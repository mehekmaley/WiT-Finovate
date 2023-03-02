import pypdf
pdf = pypdf.PdfReader(open('imdb.pdf', "rb"))
text = ''
for page in pdf.pages:
    text = text + page.extract_text()

text = text.replace('\n', '')
text = text.replace('\xa0', '')

print(text)