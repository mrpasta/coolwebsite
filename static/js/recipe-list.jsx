var styles = require('./styles.js')

var RecipeListItem = require('./recipe-list-item.jsx')

module.exports = React.createClass({
  displayName: "RecipeList",
  render: function() {
    var recipes = this.props.recipes.map(function(recipe) {
      return (
        <RecipeListItem
          key={recipe.recipeid}
          recipeid={recipe.recipeid}
          recipetitle={recipe.recipetitle}
          checked={this.props.selected.indexOf(recipe.recipeid) != -1} // TODO: this is kinda ugly
          onClick={this.props.onRecipeClick}
          onSelectedChange={this.props.onSelectedChange} />
      );
    }.bind(this));
    var largewidth = this.props.currentrecipe ? "l7 pull-l5" : "l12"
    return (
      <div className={"collection col s12 " + largewidth}>
        {recipes}
      </div>
    );
  }
});
