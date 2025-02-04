from rdflib import Graph
from collections import Counter
import os

rdf_basepath = os.path.abspath(".")
g = Graph()
g.parse(rdf_basepath + "/Data/MovieGenre_100_complete.ttl", format="turtle")

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
        "theme":{}
    }
}

def escape_list_for_sparql(items):
    return ['"' + item.replace('"', '\\"') + '"' for item in items]

def format_values_sparql(filter):
    values = filter.get("values", [])
    if not values:
        return ""
    safe_values = escape_list_for_sparql(values)
    return ', '.join(safe_values)

def filter_by_image_property(filter, filter_type):
    safe_values_str = format_values_sparql(filter)
    if not safe_values_str:
        return ""
    return f""" FILTER (STR(?{filter_type}) IN ({safe_values_str})) """

def filter_by_image_size(filter, filter_type):
    min_size = filter.get("min", -100000)
    max_size = filter.get("max", 100000)
    return f""" FILTER (?{filter_type} >= {min_size} && ?{filter_type} <= {max_size}) """

def filter_by_emotion(filter):
    safe_emotions_str = format_values_sparql(filter)
    if not safe_emotions_str:
        return ""
    return f"""FILTER (EXISTS {{
                ?image foaf:depicts [
                    a schema:Person ;
                    impr:emotion ?emotion
                ] .
                FILTER (STR(?emotion) IN ({safe_emotions_str}))
            }})
        """

def filter_by_theme(filter):
    safe_themes_str = format_values_sparql(filter)
    if not safe_themes_str:
        return ""
    return f"""FILTER (EXISTS {{
                {{
                    # Check main theme
                    ?image impr:hasTheme [
                        a skos:Concept ;
                        impr:mainLabel ?theme
                    ] .
                }} UNION {{
                    # Check alternative themes
                    ?image impr:hasTheme [
                        a skos:Concept ;
                        skos:altLabel ?theme
                    ] .
                }}
                FILTER (STR(?theme) IN ({safe_themes_str}))
            }})
            """

def filter_by_imdb_score(filter):
    min_score = filter.get("min", -100000)
    max_score = filter.get("max", 100000)
    min_score = -100000 if not min_score else min_score
    max_score = 100000 if not max_score else max_score
    return f""" FILTER (?imdb_score >= {min_score} && ?imdb_score <= {max_score}) """

def filter_movies_by_title(filter):
    safe_titles_str = format_values_sparql(filter)
    if not safe_titles_str:
        return ""
    return f""" FILTER (STR(?title) IN ({safe_titles_str})) """

def filter_by_image_elements(filter, filter_type):
    relationship = filter_types["image_filters"][filter_type]["relationship"]
    safe_elements_str =  format_values_sparql(filter)
    if not safe_elements_str:
        return ""
    return f""" FILTER (EXISTS {{
                    ?image {relationship} ?{filter_type}_item .
                    FILTER (STR(?{filter_type}_item) IN ({safe_elements_str}))
                }}) """

def filter_movie_genres(filter):
    safe_genres_str = format_values_sparql(filter)
    if not safe_genres_str:
        return ""
    return f""" FILTER (EXISTS {{
                    ?imdb_link schema:genre ?g .
                    FILTER (STR(?g) IN ({safe_genres_str}))
                }}) """

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

    movie_filters_str = ""
    movie_filters = filter_types["movie_filters"]
    image_filters = filter_types["image_filters"]
    for filter_type in movie_filters:
        match filter_type:
            case "imdb_link":
                select_query_str += " ?imdb_link a schema:Movie ;"
            case "title" | "image":
                select_query_str += f" {movie_filters[filter_type]['relationship']} ?{filter_type} ;"
                if filter_type == 'title' and filter_type in filters:
                    movie_filters_str += filter_movies_by_title(filters[filter_type])
            case "imdb_score":
                select_query_str += f" schema:aggregateRating [ schema:ratingValue ?imdb_score ] ."
                if filter_type in filters:
                    movie_filters_str += filter_by_imdb_score(filters[filter_type])
            case "genre":
                if filter_type in filters:
                    movie_filters_str += filter_movie_genres(filters[filter_type])

                select_query_str += movie_filters_str
                select_query_str += """ {
                                            SELECT ?imdb_link (GROUP_CONCAT(DISTINCT ?genre; separator = ", ") AS ?genres)
                                            WHERE {
                                                ?imdb_link schema:genre ?genre .
                                            }
                                            GROUP BY ?imdb_link
                                        } """
            case _:
                pass
    image_filters_str = ""
    for filter_type in image_filters:
        match filter_type:
            case "compression" | "pixel_format" | "bits_per_pixel" | "endianness" | "mime_type" | "content_rating":
                select_query_str += f" OPTIONAL {{ ?image {image_filters[filter_type]['relationship']} ?{filter_type} . }}"
                if filter_type in filters:
                    if filter_type == "bits_per_pixel":
                        image_filters_str = filter_by_image_size(filters[filter_type], filter_type)
                    else:
                        image_filters_str = filter_by_image_property(filters[filter_type], filter_type)
            case "width" | "height":
                select_query_str += f" OPTIONAL {{ ?image {image_filters[filter_type]['relationship']} [ {image_filters[filter_type]['val_relationship']} ?{filter_type} ] . }}"
                if filter_type in filters:
                    image_filters_str = filter_by_image_size(filters[filter_type], filter_type)
            case "clothing" | "object":
                if filter_type in filters:
                    select_query_str += filter_by_image_elements(filters[filter_type], filter_type)
                select_query_str += f""" OPTIONAL {{ SELECT ?imdb_link ?title ?image ?imdb_score ?genres ?compression ?pixel_format ?bits_per_pixel 
                                                ?content_rating ?endianness ?mime_type ?width ?height {'?clothes' if filter_type == 'object' else ''} 
                                                (GROUP_CONCAT(?{filter_type}; separator=", ") AS ?{image_filters[filter_type]['plural']})
                                                     WHERE {{ OPTIONAL {{ ?image {image_filters[filter_type]['relationship']} ?{filter_type} . }} }}
                                                     GROUP BY ?image }}"""
            case "emotion":
                if filter_type in filters:
                    select_query_str += filter_by_emotion(filters[filter_type])
                select_query_str += """ OPTIONAL { SELECT ?imdb_link ?title ?image ?imdb_score ?genres ?compression ?pixel_format 
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
                                        GROUP BY ?image }"""
            case "theme":
                if filter_type in filters:
                    select_query_str += filter_by_theme(filters[filter_type])
                select_query_str += """ OPTIONAL { SELECT ?imdb_link ?title ?image ?imdb_score ?genres ?compression ?pixel_format 
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
                                        GROUP BY ?image ?main_theme }"""
        select_query_str += image_filters_str
        image_filters_str = ""
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


def clear_empty_filters(filters):
    for filter in list(filters.keys()):
        if "values" in filters[filter] and (not filters[filter]["values"] or filters[filter]["values"] == [''] ):
            del filters[filter]
        elif "max" in filters[filter] and (not filters[filter]["max"] and not filters[filter]["max"]):
            del filters[filter]


def apply_filters(filters, search_term):
    clear_empty_filters(filters)
    select_query_str = create_select_query(filters, search_term)
    query = g.query(select_query_str)
    filtered_images = []
    for imdb_link, title, image, imdb_score, genres, compression, pixel_format, bits_per_pixel, content_rating, endianness, mime_type, width, height, clothes, objects, emotions, main_theme, alt_themes, in query:
        image_object = {
            "poster_url" : str(image),
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

        filtered_images.append(image_object)
    return filtered_images

def create_filters(filters, new_image_data):
    new_filters = {}
    for data_category in new_image_data:
        new_filter = {"label": new_image_data[data_category]["label"]}
        match new_image_data[data_category]["type"]:
            case "string":
                new_filter["type"] = "checkbox"
                distinct_values = Counter(new_image_data[data_category]["values"])
                new_filter["searchable"] = len(distinct_values) > 10
                selected = []
                remaining = []

                for key, val_count in distinct_values.items():
                    option = {
                        "label": key,
                        "count": val_count,
                        "value": key
                    }
                    if data_category in filters and key in filters[data_category]["values"]:
                        option["selected"] = True
                        selected.append(option)
                    else:
                        option["selected"] = False
                        remaining.append(option)
                selected.extend(remaining)
                new_filter["options"] = selected
            case "number":
                new_filter["type"] = "range"
                new_filter["searchable"] = False
                new_filter["min_label"] = "Minimum"
                new_filter["max_label"] = "Maximum"
                min_value = min(new_image_data[data_category]["values"])
                max_value = max(new_image_data[data_category]["values"])
                new_filter["min_recommended_value"] = min_value
                new_filter["max_recommended_value"] = max_value
                if data_category in filters:
                    curr_min = float(filters[data_category].get("min", -100000))
                    curr_max = float(filters[data_category].get("max", 100000))
                    new_filter["min_value"] = curr_min if curr_min > min_value else min_value
                    new_filter["max_value"] = curr_max if curr_max < max_value else max_value
                else:
                    new_filter["min_value"] = min_value
                    new_filter["max_value"] = max_value
        new_filters[data_category] = new_filter

    return new_filters

def update_filters(filters, filtered_images):
    mime_type = []
    content_rating = []
    compression = []
    width = []
    height = []
    bits_per_pixel = []
    pixel_format = []
    endianness = []
    title = []
    imdb_score = []
    genre = []
    objects = []
    theme = []
    clothing = []
    emotion = []

    for image in filtered_images:
        mime_type.append(image["metadata"]["mime_type"])
        content_rating.append(image["metadata"]["content_rating"])
        compression.append(image["metadata"]["compression"])
        width.append(image["metadata"]["width"])
        height.append(image["metadata"]["height"])
        bits_per_pixel.append(image["metadata"]["bits_per_pixel"])
        pixel_format.append(image["metadata"]["pixel_format"])
        endianness.append(image["metadata"]["endianness"])
        title.append(image["movie_data"]["title"])
        imdb_score.append(image["movie_data"]["imdb_score"])
        genre.extend(image["movie_data"]["genre"])
        objects.extend(set(image["object"]))
        theme.extend(set(image["theme"]))
        clothing.extend(set(image["clothing"]))
        emotion.extend(set(image["emotion"]))

    new_image_data = {
        "title": {
            "values": title,
            "label": "Movie title",
            "type": "string"
        },
        "imdb_score": {
            "values": imdb_score,
            "label": "IMDB Score",
            "type": "number"
        },
        "genre": {
            "values": genre,
            "label": "Genre",
            "type": "string"
        },
        "mime_type": {
            "values": mime_type,
            "label": "File type",
            "type": "string"
        },
        "compression": {
            "values": compression,
            "label": "Compression",
            "type": "string"
        },
        "width": {
            "values": width,
            "label": "Image width",
            "type": "number"
        },
        "height": {
            "values": height,
            "label": "Image height",
            "type": "number"
        },
        "bits_per_pixel": {
            "values": bits_per_pixel,
            "label": "Bits per pixel",
            "type": "number"
        },
        "pixel_format": {
            "values": pixel_format,
            "label": "Pixel format",
            "type": "string"
        },
        "endianness": {
            "values": endianness,
            "label": "Endianness",
            "type": "string"
        },
        "content_rating": {
            "values": content_rating,
            "label": "Is image safe for work",
            "type": "string"
        },
        "object": {
            "values": objects,
            "label": "Contains objects",
            "type": "string"
        },
        "theme": {
            "values": theme,
            "label": "Photo theme",
            "type": "string"
        },
        "clothing": {
            "values": clothing,
            "label": "Fashion articles in photo",
            "type": "string"
        },
        "emotion": {
            "values": emotion,
            "label": "Emotions on faces",
            "type": "string"
        },
    }

    new_filters = create_filters(filters, new_image_data)

    return new_filters

def main():
    filters={
        # "title":{
        #     "values": ["The Crossing Guard (1995)", "On the Line (2001)"]
        # },
        # "genre": {
        #     "values": ["Comedy", "Family", "Horror", "Romance", "Drama"]
        # },
        # "imdb_score": {
        #     "min": 5.9,
        #     "max": 6.3
        # },
        # 'compression': {
        #     "values": ['JPEG (Baseline)']
        # },
        # 'mime_type': {
        #     "values": ['image/jpeg']
        # },
        # 'content_rating': {
        #     "values": ['SFW']
        # },
        # 'pixel_format': {
        #     "values": ['YCbCr']
        # },
        # 'endianness': {
        #     "values": ['Big endian']
        # },
        # "bits_per_pixel": {
        #     "min": 24,
        #     "max": 24
        # },
        # "width": {
        #     "min": 182,
        #     "max": 182
        # },
        # "height": {
        #     "min": 268,
        #     "max": 268
        # },
        # "clothing": {
        #     "values": ["jacket"]
        # },
        # "object": {
        #     "values": ["Man", "Woman"]
        # },
        # "emotion": {
        #     "values": ["neutral", "happiness"]
        # },
        "theme": {
            "values": ["Pulp"]
        },
    }
    # get_all_images()
    # get_all_clothing(images)
    # print(create_select_query(filters, ""))
    print(apply_filters(filters, ""))
    # filtered_images = apply_filters({}, "")
    # new_filters = update_filters({}, filtered_images)
    # print(new_filters)

if __name__ == '__main__':
    main()
