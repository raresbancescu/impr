from pybullet_examples.heightfield import height
from rdflib import URIRef, BNode, Literal, Namespace, Graph
from rdflib.namespace import FOAF, DCTERMS, XSD, RDF, SDO, DC, SKOS
import csv

from rdflib.plugins.sparql.parser import BlankNode

EXIF = Namespace("https://developer.adobe.com/xmp/docs/XMPNamespaces/exif/")
IMPR = Namespace('http://example.org/impr/')
MFOEM = Namespace("http://purl.obolibrary.org/obo/mfoem.owl#")

emotion_mapping = {
    "happy": MFOEM.happiness,
    "neutral": MFOEM.NeutralEmotionalState,
    "sad": MFOEM.Sadness,
    "angry": MFOEM.Anger,
    "surprise": MFOEM.Surprise,
    "fear": MFOEM.Fear,
    # Add more mappings as needed
}

def process_main_themes(g, image_uri, themes_str):
    # Split and process synonyms
    synonyms = [s.strip() for s in themes_str.split(',')]
    primary_theme = synonyms[0]

    theme = BlankNode()
    g.add((theme, RDF.type, SKOS.Concept))
    g.add((theme, IMPR.mainLabel, Literal(primary_theme)))
    for s in synonyms[1:]:
        g.add((theme, SKOS.altLabel, Literal(s)))
    g.add((image_uri, IMPR.hasTheme, theme))


def process_faces(g, image_uri, emotions_str):
    emotions = emotions_str.split('|') if emotions_str else []

    for emotion in emotions:
        face_node = BNode()

        # Link face to image
        g.add((image_uri, SDO.depicts, face_node))
        g.add((face_node, RDF.type, SDO.Person))

        g.add((face_node, IMPR.emotion, Literal(emotion)))


def build_rdf(movie_file):
    g = Graph()
    g.bind('impr', IMPR)
    g.bind('foaf', FOAF)
    g.bind('dcterms', DCTERMS)
    g.bind('xsd', XSD)
    g.bind("skos", SKOS)
    g.bind("mfoem", MFOEM)

    with open(movie_file, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            movie_uri = URIRef(row["Imdb Link"])
            # Basic movie info
            g.add((movie_uri, RDF.type, SDO.Movie))
            g.add((movie_uri, SDO.name, Literal(row['Title'])))
            g.add((movie_uri, SDO.contentRating, Literal( "SFW" if row['Rating'] == "ok" else "NSFW")))

            rating = BNode()
            g.add((movie_uri, SDO.aggregateRating, rating))
            g.add((rating, RDF.type, SDO.AggregateRating))
            g.add((rating, SDO.ratingValue, Literal(float(row['IMDB Score']), datatype=XSD.float)))

            for genre in row['Genre'].split('|'):
                g.add((movie_uri, SDO.genre, Literal(genre)))

            # Image properties
            image_uri = URIRef(row['Poster'])
            g.add((movie_uri, SDO.image, image_uri))
            g.add((image_uri, RDF.type, SDO.ImageObject))
            g.add((image_uri, DC.format, Literal(row['MIME type'])))

            width_value, width_unit = row['Image width'].split()
            height_value, height_unit = row['Image height'].split()
            # Create structured value node
            width_node = BNode()
            g.add((width_node, RDF.type, SDO.QuantitativeValue))
            g.add((width_node, SDO.value, Literal(int(width_value), datatype=XSD.integer)))
            g.add((width_node, SDO.unitCode, Literal("E37", datatype=XSD.text)))  # UN/CEFACT code for "pixel"
            g.add((image_uri, SDO.width, width_node))

            height_node = BNode()
            g.add((height_node, RDF.type, SDO.QuantitativeValue))
            g.add((height_node, SDO.value, Literal(int(height_value), datatype=XSD.integer)))
            g.add((height_node, SDO.unitCode, Literal("E37", datatype=XSD.text)))  # UN/CEFACT code for "pixel"
            g.add((image_uri, SDO.height, height_node))

            g.add((image_uri, EXIF.CompressedBitsPerPixel, Literal(int(row['Bits/pixel']), datatype=XSD.integer)))
            g.add((image_uri, IMPR.pixelFormat, Literal(row['Pixel format'])))
            g.add((image_uri, IMPR.compression, Literal(row['Compression'])))
            g.add((image_uri, IMPR.endianness, Literal(row['Endianness'])))

            # Custom properties (split pipe-separated values)
            if row['Objects']:
                for obj in row['Objects'].split('|') if row['Objects'] else []:
                    g.add((movie_uri, IMPR.containsObject, Literal(obj)))

            if row['MainThemes']:
                process_main_themes(g, image_uri, row['MainThemes'])

            if row['Clothes']:
                for cloth in row['Clothes'].split('|') if row['Clothes'] else []:
                    g.add((movie_uri, IMPR.containsClothing, Literal(cloth)))

            if row['Emotions']:
                process_faces(g, image_uri, row['Emotions'])

    g.serialize(destination=movie_file.split('.')[0] + ".ttl", format='turtle')

def main():
    build_rdf("data/subsets/MovieGenre_1000_complete.csv")

if __name__ == '__main__':
    main()