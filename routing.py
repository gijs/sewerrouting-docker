import pdb
import pyspatialite.dbapi2 as db

class Routing:
    def __init__(self, con):
        self.conn = con

    def compute_route(self, lat_from, lng_from, lat_to, lng_to):
        node_from = self.get_nearest_node(lat_from, lng_from)
        node_to = self.get_nearest_node(lat_to, lng_to)
        if node_to == None or node_from == None:
            return ""       
        cur = self.conn.cursor()
        query = """
            SELECT asgeojson(geometry) 
            FROM sewer_net
            WHERE nodeFrom={node_from}
            AND nodeTo={node_to}
        """.format(node_from = node_from, node_to = node_to)
        cur.execute(query)
        rec = cur.fetchone()
        cur.close()
        return rec[0]


    def get_side_profile(self, lat_from, lng_from, lat_to, lng_to):
        node_from = self.get_nearest_node(lat_from, lng_from)
        node_to = self.get_nearest_node(lat_to, lng_to)
        if node_to == None or node_from == None:
            return ""       
        cur = self.conn.cursor()
        query = """
            SELECT
                r.original_length AS original_length,
                m.surface_level AS surface_level,
                m.bottom_level AS bottom_level,
                csd.width AS pipe_diameter,
                r.invert_level_start_point AS invert_level_start,
                r.invert_level_end_point AS invert_level_end,
                r.display_name AS display_name
            FROM 
                sewer_net AS n
            LEFT JOIN 
                sewerage_manhole m
            LEFT JOIN 
                routesource AS r
            LEFT JOIN
                sewerage_cross_section_definition csd                
            ON 
                (n.ArcRowid = r.id)
            WHERE 
                n.NodeFrom = {node_from} and n.NodeTo = {node_to}
            AND
                csd.id = r.crosssection_definition_id
            AND
                m.id = r.manhole_start_id;                        
        """.format(node_from = node_from, node_to = node_to)
        cur.execute(query)
        rec = cur.fetchall()
        cur.close()
        return rec

            
    # Limit the search to 1000 m
    def get_nearest_node(self, lat, lng):
        cur = self.conn.cursor()
        query = """
            SELECT 
                manhole_start_id, manhole_end_id,
                ST_Distance(MakePoint({lng}, {lat}), PointN(the_geom, 1)) as dist_node_from, 
                ST_Distance(MakePoint({lng}, {lat}), PointN(the_geom, NumPoints(the_geom))) as dist_node_to                
            FROM routesource 
            WHERE ROWID IN 
            (  SELECT pkid
                    FROM idx_routesource_the_geom
               WHERE xmin < {lng} + 0.01 AND xmax > {lng} - 0.01
                    AND ymin < {lat} + 0.01 AND ymax > {lat} - 0.01
            )
            ORDER BY Distance(MakePoint({lng}, {lat}), the_geom)
            LIMIT 1            
        """.format(lat = lat, lng = lng)
        cur.execute(query)
        rec = cur.fetchone()
        cur.close()

        if rec == None:
            return None
        else:
            return rec[1]

    def get_extent(self):
        cur = self.conn.cursor()
        query = """
            SELECT 
				X(PointN(linestring_bbox, 1)) as minx, 
				Y(PointN(linestring_bbox, 1)) as miny, 
				X(PointN(linestring_bbox, 3)) as maxx, 
				Y(PointN(linestring_bbox, 3)) as maxy 
				FROM (
					SELECT ST_Transform(
						ExteriorRing(SetSrid(Extent(the_geom), 4326)), 
					  3785) as linestring_bbox FROM routesource
				)
        """
        cur.execute(query)
        rec = cur.fetchone()
        res = { 'minx' : rec[0], 'miny' : rec[1], 'maxx' : rec[2], 'maxy' : rec[3] }
        return res
