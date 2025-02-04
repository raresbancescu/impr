# IMPR project by DaRe Web: Apostu Daniel, Bancescu Rares Emil
App is live at: https://impr-git-main-raresbancescus-projects.vercel.app/ \
Link prezentare video: https://drive.google.com/file/d/1_DPIbvaNCfPbvR-hZ6N9q3zQVP7lKmKj/view?usp=sharing \
Diagrama Data Pipeline: [Diagrama](other_documents/scholarly/images/impr_data_pipeline.png) \
Link dataset: https://www.kaggle.com/datasets/neha1703/movie-genre-from-its-poster?select=MovieGenre.csv 

## Descriere
Proiectul Smart Image Proceesor se foloseste de setul de date [Movie Genre from its Poster]( https://www.kaggle.com/datasets/neha1703/movie-genre-from-its-poster?select=MovieGenre.csv) pentru a aplica diverse filtre.
Setul de date contine date despre filme, inclusiv url-ul posterului.
Pentru procesarea datelor:
1. Extragem un subset mai mic din date
2. Descarcam pozele cu ajutorul url-ului pentru poster, filtram filmele pentru care url-ul e inaccesibil
3. Prin intermediul platformei Deepdetect, rulata local prin docker, extragem date extra din poze, folosing algoritmi de machine learning:
    1. detection_600 : sunt extrase obiectele indentificate in imagine
    2. clasification_21k: detectam obiectul din prim plan al imaginii, daca el exista, plus termeni alternativi pentru el
    3. nsfw: imaginea este clasificata ca Safe For Work sau Not Safe For Work
    4. basic_fashion_v2: sunt extrase articolele de imbracaminte din imagine
    5. emo_model: detectam emotiile de pe fetele din poze
4. Extragem metadatele imaginilor descaracate: 'Image width', 'Image height', 'Bits/pixel', 'Pixel format', 'Compression',  'Format version', 'MIME type', 'Endianness'
5. Totalizam datele intr-un singur fisier MovieGenre_1000_complete.csv
6. Creem un graf RDF cu datele din fisierul totalizat, pe care il serializam in MovieGenre_1000_complete.ttl

Cele 2 componente principale ale proiectlui sunt serverul flask ca serviciu de backend si o aplicatie React cu next.js ca serviciu de frontend. \
Serviciul de backend incarca in memorie graful RDF. \
Servicul de frontend trimite un request la backend pe route "/api/initial" pentru a obtine toate datele despre poze. \
Backend construieste query-ul pentru a selecta toate datele(acest query este construit iterativ, odata construit arata asa [select_all_working_version.rq](impr_backend/queries/select_all_working_version.rq) \
Cu ajutorul informatiilor din imagini, se contruiesc si datele despre filterle posibile pentru aceste date. \
Utilizatorul interactioneaza cu filtrele in aplicatie, poate face selectii multiple iar odata ce apasa "Filter", este apelata ruta "/api/filter" din backend, datele din filtre fiind transmise ca query parameters \
Backend construieste query-ul pentru a selecta datele in dependenta de filtre(acest query este construit iterativ, ar putea arata asa [select_with_filtering.rq](impr_backend/queries/select_with_filtering.rq) \
Sunt returnate datele filtrate, plus informatia pentru noile filtre posibile.
