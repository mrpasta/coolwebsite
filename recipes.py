from itertools import count
from os import listdir
from os.path import join
from re import search, sub

id_counter = count()

latex_to_html = {
    r'\\\\': '',
    r'\\newpage': '',
    r'\\&': '&amp;',
    r'\\_': '_',
    r'\\ldots': '&hellip;',
    r'\\ldots{}': '&hellip;',
    r'\\textquotedblleft{}': '&ldquo;',
    r'\\textquotedblright{}': '&rdquo;',
    r'\\textquoteright{}': '&rsquo;',
    r'\\textendash{}': '&ndash;',
    r'\\textrussian{(.*)}': r'\1',
    '\n': '<br />'
}

def read_recipe(title):
    with open(join('recipes', title), 'r') as recipe:
        tex = recipe.read()
        recipeid    = id_counter.__next__()
        recipetitle = search(r'\\recipetitle{(.*)}', tex)
        firstline = search(r'\\firstline{(.*)}', tex)
        alttitle  = search(r'\\alttitle{(.*)}', tex) # should do findall
        recipemeta  = search(r'\\begin{recipemeta}(((.*)\n)*)\\end{recipemeta}', tex)
        recipetext  = search(r'\\begin{recipetext}(((.*)\n)*)\\end{recipetext}', tex)
        recipenotes = search(r'\\begin{recipenotes}(((.*)\n)*)\\end{recipenotes}', tex)

    def parse_match(match):
        if not match: return None

        text = match.group(1).strip()

        for key, value in latex_to_html.items():
            text = sub(key, value, text)

        return text

    return {
        'tex': tex,
        'recipeid': recipeid,
        'recipetitle': parse_match(recipetitle),
        'alttitle':  parse_match(alttitle),
        'firstline': parse_match(firstline),
        'recipemeta':  parse_match(recipemeta),
        'recipetext':  parse_match(recipetext),
        'recipenotes': parse_match(recipenotes)
    }

def get_recipes():
    return {
        recipe['recipeid']: recipe
        for recipe in [
            read_recipe(title)
            for title in sorted(listdir('recipes'))
        ]
    }
