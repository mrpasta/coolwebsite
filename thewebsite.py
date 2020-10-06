from flask import Flask, request, jsonify, abort, Response, render_template
from flask_assets import Environment, Bundle
from webassets_browserify import Browserify

from latex import build_pdf, LatexBuildError
from latex.jinja2 import make_env

from recipes import get_recipes

app = Flask(__name__, static_url_path='/static')

assets = Environment(app)
js = Bundle('js/main.jsx',
            depends=('*/*.js*'),
            filters=Browserify,
            output='app.js')
assets.register('js_all', js)

@app.route('/')
def index(): return render_template('index.html')

recipe_dict = get_recipes()
recipe_list = recipe_dict.values()
@app.route('/recipes/')
@app.route('/recipes/<int:recipeid>')
def recipes(recipeid=None):
    def filter_keys(item):
        return {
            key: item[key]
            for key in [
                'recipeid',
                'recipetitle',
                'firstline',
                'recipemeta',
                'recipetext',
                'recipenotes'
            ]
        }

    if recipeid == None:      return jsonify(recipes=list(map(filter_keys, recipe_list)))
    if recipeid in recipe_dict: return jsonify(filter_keys(recipe_dict[recipeid]))
    else:                   return abort(404)

texenv = make_env(loader=app.jinja_loader)
@app.route('/recipes.pdf')
def pdf():
    texonly     = 'texonly' in request.args
    orientation = 'landscape' if 'landscape' in request.args else 'portrait'
    cols        = request.args.get('cols') or 2
    font        = request.args.get('font')
    fontoptions = request.args.get('fontoptions')
    recipeids     = request.args.get('recipeids')

    if recipeids:
        try:
            recipeids = map(int, recipeids.split(','))
        except ValueError:
            return 'Invalid recipeid'
    else:
        return 'No recipes'

    template = texenv.get_template('recipes.tex')
    tex = template.render(
        recipes=[recipe_dict[x] for x in recipeids if x in recipe_dict],
        cols=cols,
        orientation=orientation,
        font=font,
        fontoptions=fontoptions)

    if texonly:
        return Response(tex, mimetype='text/plain')
    else:
        try:
            pdffile = build_pdf(tex)
        except LatexBuildError as e:
            return Response(tex, mimetype='text/plain')

        return Response(bytes(pdffile), mimetype='application/pdf')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
