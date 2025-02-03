from rdflib import Graph

g = Graph()
g.parse("data/MovieGenre_50_complete.ttl", format="turtle")

filter_types = {
    "movie_filters": {
        "imdb_link": {},
        "title": {
            "relationship": "schema:name"
        },
        "image": {
            "relationship": "schema:image"
        },
        "imdb_score": {
        },
        "genre": {
            "relationship": "schema:genre"
        },
    },
    "image_filters":{
        "compression": {
            "relationship": "impr:compression",
        },
        "pixel_format": {
            "relationship": "impr:pixelFormat",
        },
        "bits_per_pixel": {
            "relationship": "ns1:CompressedBitsPerPixel",
        },
        "content_rating": {
            "relationship": "schema:contentRating",
        },
        "endianness": {
            "relationship": "impr:endianness",
        },
        "mime_type": {
            "relationship": "dc:format",
        },
        "width": {
            "relationship": "schema:width",
            "val_relationship": "schema:value"
        },
        "height": {
            "relationship": "schema:height",
            "val_relationship": "schema:value"
        },
        "clothing": {
                    "relationship": "impr:containsClothing",
                    "plural": "clothes"
                },
        "object": {
            "relationship": "impr:containsObject",
            "plural": "objects"
        },
        "emotion":{},
        "themes":{}
    }
}


def filter_by_image_property(param, filter_type, select_query_str):
    pass


def filter_by_image_size(param, filter_type, select_query_str):
    pass


def filter_by_emotion(param, filter_type, select_query_str):
    pass


def filter_by_theme(param, filter_type, select_query_str):
    pass


def filter_by_imdb_score(param, filter_type, select_query_str):
    pass


def filter_movie_properties(param, filter_type, select_query_str):
    pass


def filter_by_image_elements(param, filter_type, select_query_str):
    pass


def filter_movie_genres(param, filter_type, select_query_str):
    pass


def create_select_query(filters, search_term):
    select_query_str = """   
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX impr: <http://example.org/impr/>
    PREFIX ns1: <https://developer.adobe.com/xmp/docs/XMPNamespaces/exif/>
    PREFIX schema: <https://schema.org/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
    SELECT ?imdb_link ?title ?image ?imdb_score ?genres ?compression ?pixel_format ?bits_per_pixel ?content_rating
    ?endianness ?mime_type ?width ?height ?clothes ?objects ?emotions ?main_theme ?alt_themes
    
    WHERE { """

    movie_filters = filter_types["movie_filters"]
    image_filters = filter_types["image_filters"]
    for filter_type in movie_filters:
        match filter_type:
            case "imdb_link":
                select_query_str += " ?imdb_link a schema:Movie ;"
            case "title" | "image":
                if filter_type in filters:
                    filter_movie_properties(filters[filter_type], filter_type, select_query_str)
                else:
                    select_query_str += f" {movie_filters[filter_type]['relationship']} ?{filter_type} ;"
            case "imdb_score":
                if filter_type in filters:
                    filter_by_imdb_score(filters[filter_type], filter_type, select_query_str)
                else:
                    select_query_str += f" schema:aggregateRating [ schema:ratingValue ?imdb_score ] ."
            case "genre":
                if filter_type in filters:
                    filter_movie_genres(filters[filter_type], filter_type, select_query_str)
                else:
                    select_query_str += """ {
                                                SELECT ?imdb_link (GROUP_CONCAT(DISTINCT ?genre; separator = ", ") AS ?genres)
                                                WHERE {
                                                    ?imdb_link schema:genre ?genre .
                                                }
                                                GROUP BY ?imdb_link
                                            } """
            case _:
                pass
    for filter_type in image_filters:
        select_query_str += " OPTIONAL {"
        match filter_type:
            case "compression" | "pixel_format" | "bits_per_pixel" | "endianness" | "mime_type" | "content_rating":
                if filter_type in filters:
                    filter_by_image_property(filters[filter_type], filter_type, select_query_str)
                else:
                    select_query_str += f" ?image {image_filters[filter_type]['relationship']} ?{filter_type} . "
            case "width" | "height":
                if filter_type in filters:
                    filter_by_image_size(filters[filter_type], filter_type, select_query_str)
                else:
                    select_query_str += f" ?image {image_filters[filter_type]['relationship']} [ {image_filters[filter_type]['val_relationship']} ?{filter_type} ] . "
            case "clothing" | "object":
                if filter_type in filters:
                    filter_by_image_elements(filters[filter_type], filter_type, select_query_str)
                else:
                    select_query_str += f""" SELECT ?imdb_link ?title ?image ?imdb_score ?genres ?compression ?pixel_format ?bits_per_pixel 
                                                ?content_rating ?endianness ?mime_type ?width ?height {'?clothes' if filter_type == 'object' else ''} 
                                                (GROUP_CONCAT(?{filter_type}; separator=", ") AS ?{image_filters[filter_type]['plural']})
                                                     WHERE {{ OPTIONAL {{ ?image {image_filters[filter_type]['relationship']} ?{filter_type} . }} }}
                                                     GROUP BY ?image """
            case "emotion":
                if filter_type in filters:
                    filter_by_emotion(filters[filter_type], filter_type, select_query_str)
                else:
                    select_query_str += """ SELECT ?imdb_link ?title ?image ?imdb_score ?genres ?compression ?pixel_format 
                                                    ?bits_per_pixel ?content_rating ?endianness ?mime_type ?width ?height ?clothes ?objects 
                                                (GROUP_CONCAT(?emotion; separator=", ") AS ?emotions) 
                                            WHERE {
                                                OPTIONAL {
                                                    ?image foaf:depicts [ 
                                                        a schema:Person ;
                                                        impr:emotion ?emotion 
                                                    ] .
                                                }
                                            }
                                            GROUP BY ?image """
            case "themes":
                if filter_type in filters:
                    filter_by_theme(filters[filter_type.key], filter_type, select_query_str)
                else:
                    select_query_str += """SELECT ?imdb_link ?title ?image ?imdb_score ?genres ?compression ?pixel_format 
                                                    ?bits_per_pixel ?content_rating ?endianness ?mime_type ?width ?height 
                                                    ?clothes ?objects ?emotions ?main_theme 
                                                (GROUP_CONCAT(?alt_theme; separator=", ") AS ?alt_themes)
                                            WHERE { 
                                                OPTIONAL {
                                                    ?image impr:hasTheme [ 
                                                        a skos:Concept ;
                                                        impr:mainLabel ?main_theme ;
                                                        skos:altLabel ?alt_theme 
                                                    ] .
                                                }
                                            }
                                            GROUP BY ?image ?main_theme """
        select_query_str += " } "
    select_query_str += """}
    GROUP BY ?imdb_link ?title ?image ?imdb_score ?genres ?compression ?pixel_format ?bits_per_pixel ?content_rating
            ?endianness ?mime_type ?width ?height ?clothes ?objects ?emotions ?main_theme ?alt_themes
            """
    return select_query_str


def extract_themes(main_theme, alt_themes):
    themes = []
    if main_theme:
        themes.append(str(main_theme))
        for alt_theme in str(alt_themes).split(", "):
            themes.append(alt_theme)
    return themes


def apply_filters(filters, search_term):
    select_query_str = create_select_query(filters, search_term)
    print(select_query_str)
    query = g.query(select_query_str)
    filtered_images = {}
    for imdb_link, title, image, imdb_score, genres, compression, pixel_format, bits_per_pixel, content_rating, endianness, mime_type, width, height, clothes, objects, emotions, main_theme, alt_themes, in query:
        image_object = {
            "metadata": {
                "mime_type": str(mime_type),
                "content_rating": str(content_rating),
                "compression": str(compression),
                "width": int(str(width)),
                "height": int(str(height)),
                "bits_per_pixel": int(str(bits_per_pixel)),
                "pixel_format": str(pixel_format),
                "endianness": str(endianness)
            },
            "movie_data": {
                "imdb_link": str(imdb_link),
                "title": str(title),
                "imdb_score": float(str(imdb_score)),
                "genre": str(genres).split(", "),
            },
            "object": str(objects).split(", ") if str(objects) else [],
            "theme": extract_themes(main_theme, alt_themes),
            "clothing": str(clothes).split(", ") if str(clothes) else [],
            "emotion": str(emotions).split(", ") if str(emotions) else [],
        }

        filtered_images[str(image)] = image_object
    return filtered_images

def update_filters(filters, filtered_images):
    new_filters = {}
    return new_filters


def get_all_images():
    query = g.query('''
        SELECT ?image
        WHERE{
        ?image
            a schema:ImageObject ;
        }
    ''')
    images = [str(image) for image, *_ in query]
    for row in query:
        print(row)
    return images

# def get_all_movies():
#     print(f"Nr results: {len(query)}")
#     for row in query:
#         print(row)


def get_all_clothing(images):
    image_str = ""
    for image in images:
        image_str += f" <{image}>"
    image_str += " "
    query_str = f"""
           SELECT ?clothing ?image
           WHERE{{
           VALUES ?image {{{image_str}}}
           ?image
               a schema:ImageObject ;
               impr:containsClothing ?clothing .
           }}
       """
    print(query_str)
    query = g.query(query_str)
    clothing = [str(clothing) for clothing, *_ in query]
    print(clothing)

def main():
    # get_all_images()
    # get_all_clothing(images)
    # print(create_select_query([], ""))
    apply_filters([], "")

if __name__ == '__main__':
    main()
