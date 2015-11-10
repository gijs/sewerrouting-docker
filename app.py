import pyspatialite.dbapi2 as db
import pdb
import json
from polyline.codec import PolylineCodec
from geojson import Point, Feature, LineString, FeatureCollection
from flask import Flask
from flask import request
from flask import url_for
from flask import jsonify
from flask import Response
from flask import render_template
from routing import Routing
from flask.ext.compress import Compress

app = Flask(__name__, static_url_path='/static')
Compress(app)
app.debug = True

con = db.connect('data/purmerend_big2.sqlite', check_same_thread=False)

cursor = con.execute('SELECT sqlite_version(), spatialite_version()')
print(cursor.fetchall())


@app.route("/")
def index():
	return render_template('index.html')



@app.route("/api/v1/network")
def network():
	cursor = con.execute("SELECT AsGeojson(the_geom) FROM sewerage_pipe_view")	
	results = cursor.fetchall()

	features = FeatureCollection([])

	for result in results:
		res = json.loads(result[0])
		coords = res.get('coordinates')
		
		my_feature = Feature(geometry=LineString([(coords[0][0], coords[0][1]),(coords[1][0], coords[1][1])]))
		features.features.append(my_feature)

	return jsonify(features)


@app.route("/api/v1/manholes")
def manholes():
	cursor = con.execute("SELECT AsGeojson(the_geom), id FROM sewerage_manhole")	
	results = cursor.fetchall()

	features = FeatureCollection([])

	for result in results:
		res = json.loads(result[0])
		coords = res.get('coordinates')
		
		my_feature = Feature(geometry=Point((coords[0], coords[1])), properties={"id":result[1]})
		features.features.append(my_feature)

	return jsonify(features)	


@app.route("/api/v1/nearest")
def nearest():
	lat = request.args.get('lat', '')
	lng = request.args.get('lng', '')

	routing = Routing(con)
	node_id = routing.get_nearest_node(lat,lng)
	return jsonify({'id': node_id})


@app.route("/api/v1/route")
def viaroute():
	"""


	"""
	routing = Routing(con)

	coords = request.args.getlist('loc')
	app.logger.debug('coordinates: %s', coords)

	first_pair = []
	segments = []
	polyline_segments = []
	for counter, coord in enumerate(coords):
		if counter > 0:
			previous = coords[counter-1].split(',')
			current = coords[counter].split(',')
			if counter % 2 == 0:
				segment = routing.compute_route(previous[0], previous[1], current[0], current[1])
				segcoords = json.loads(segment).get('coordinates')
				for s in segcoords:
					print "s:", s
					polyline_segments.append((s[1], s[0]))
				segments.append(json.loads(segment))

	return jsonify({
		    "hint_data": {
		        "locations": [],
		        "checksum": 0000000001
		    },
		    "route_name": ["Purmerend Riolering"],
		    "via_indices": [],
		    "found_alternative": False,
		    "route_summary": {
		        "end_point": "O 2206",
		        "start_point": "",
		        "total_time": 0,
		        "total_distance": 0
		    },
		    "via_points": [],
		    "route_geometry": PolylineCodec().encode(polyline_segments),
	        "status_message": "Found route between points",
		    "status": 0
		})


@app.route("/api/v1/computeroute")
def computeroute():
	latfrom = request.args.get('latfrom', '')
	lngfrom = request.args.get('lngfrom', '')
	latto = request.args.get('latto', '')
	lngto = request.args.get('lngto', '')

	routing = Routing(con)
	route = routing.compute_route(latfrom, lngfrom, latto, lngto)
	profile = routing.get_side_profile(latfrom, lngfrom, latto, lngto)

	bottomlevelprofile_formatted = [p[0] for p in profile]
	lengthprofile_formatted = [p[1] for p in profile]
	surfacelevel_formatted = [p[1] for p in profile]
	pipediameter_formatted = [p[3] for p in profile]
	
	bob_end_formatted = [p[4] for p in profile]
	bob_start_formatted = [p[5] for p in profile]
	
	bbb_end_formatted = [(p[4] + float(p[3])) for p in profile]
	bbb_start_formatted = [(p[5] + float(p[3])) for p in profile]

	display_names_formatted = [p[6] for p in profile]

	return jsonify({
			'route': json.loads(route),
			'surface_level': surfacelevel_formatted,
			'length_profile': lengthprofile_formatted,
			'bottom_level': bottomlevelprofile_formatted,
			'pipe_diamter': pipediameter_formatted,
			'bob_start': bob_start_formatted,
			'bob_end': bob_end_formatted,
			'bbb_start': bbb_start_formatted,
			'bbb_end': bbb_end_formatted,
			'display_names': display_names_formatted
		})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)


