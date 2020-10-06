var styles = require('./styles.js')

var RecipeList = require('./recipe-list.jsx')
var RecipeText = require('./recipe-text.jsx')

module.exports = React.createClass({
  displayName: "RecipeApp",
  fuse: {},
  getInitialState: function() {
    return {currentrecipe: false, recipes: [], selected: []};
  },
  componentDidMount: function() {
    $.getJSON("/recipes", function(data){
      var titlesort = function(x,y){return x.recipetitle.localeCompare(y.recipetitle, 'sv')};
      data.recipes.sort(titlesort);
      var options = {
        caseSensitive: false,
        includeScore: false,
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 50,
        maxPatternLength: 32,
        keys: ["recipetitle","firstline"]
      };
      this.fuse = new Fuse(data.recipes, options);
      this.setState({recipes: this.fuse.list});
      this.setState({currentrecipe: this.getRecipe(location.hash.substr(1))})
    }.bind(this));
    window.addEventListener("hashchange", function() {
      this.setState({currentrecipe: this.getRecipe(location.hash.substr(1))})
    }.bind(this));
  },
  handleSelectedChange: function(checked, recipeid) {
    var newselected;
    if(checked) newselected = this.state.selected.concat([recipeid]);
    else        newselected = this.state.selected.filter(item => item != recipeid);
    this.setState({selected: newselected})

    var link = "recipes.pdf?recipeids=" + Array.from(newselected);
    this.refs.PDFLink.href = link;
  },
  handleRecipeClick: function(recipeid) {
    this.setState({currentrecipe: this.getRecipe(recipeid)});
  },
  handleRecipeOverlayClose: function() {
    this.setState({currentrecipe: false});
    location.hash = "";
  },
  handleSearchChange: function(e) {
    if(e.target.value.length > 0) this.setState({recipes: this.search(e.target.value)});
    else                          this.setState({recipes: this.fuse.list});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var toprecipe = this.state.recipes[0];
    this.setState({currentrecipe: toprecipe});
    location.hash = toprecipe.recipeid;
  },
  search: function(searchstring) {
    if(searchstring.length > 0) return this.fuse.search(searchstring);
    else                        return this.fuse.list;
  },
  getRecipe: function(recipeid) {
    recipeid = parseInt(recipeid);
    var filter = this.fuse.list.filter(recipe => recipe.recipeid === recipeid) // TODO: this is really ugly
    if(filter.length > 0)
      return filter[0];
    else
      return false;
  },
  render: function() {
    var disabled = this.state.selected.length < 1 ? " disabled" : "";
    return (
      <div>
        <div style={styles.header} className="valign-wrapper deep-orange lighten-1">
          <div style={styles.centered}>
            <h3 className="valign" style={styles.headertext}>MrPasta recipes</h3>
            <a ref="PDFLink" target="_blank"
               style={styles.mainbutton}
               className={"btn deep-orange darken-1" + disabled}>
              PDF
            </a>
          </div>
        </div>
        <form onSubmit={this.handleSubmit} style={styles.centered}>
          <input
            style={styles.searchbar}
            type="text"
            autoFocus
            placeholder="Recipe title or firstline"
            onChange={this.handleSearchChange} />
        </form>
        <div className="row" style={styles.centered}>
          <RecipeText
            currentrecipe={this.state.currentrecipe}
            onClose={this.handleRecipeOverlayClose} />
          <RecipeList
            recipes={this.state.recipes}
            selected={this.state.selected}
            currentrecipe={this.state.currentrecipe != false}
            onRecipeClick={this.handleRecipeClick}
            onSelectedChange={this.handleSelectedChange} />
        </div>
      </div>
    );
  }
});
