var styles = require('./styles.js')

module.exports = React.createClass({
  displayName: "RecipeText",
  componentDidUpdate: function() {
    if(window.scrollY > 300) {
      window.scrollTo(0, 160);
    }
  },
  render: function() {
    if(this.props.currentrecipe != false) {
      var recipe = this.props.currentrecipe;
      return (
        <div className="col s12 l5 push-l7" style={styles.recipe}>
          <a href="#" style={styles.close}>
            <i className="material-icons"  onClick={this.props.onClose}>add</i>
          </a>
          <h3 style={styles.recipetitle} dangerouslySetInnerHTML={{__html: recipe.recipetitle}}></h3>
          <p style={styles.recipemeta} dangerouslySetInnerHTML={{__html: recipe.recipemeta}}></p>
          <p style={styles.recipetext} dangerouslySetInnerHTML={{__html: recipe.recipetext}}></p>
          <p style={styles.recipemeta} dangerouslySetInnerHTML={{__html: recipe.recipenotes}}></p>
        </div>
      );
    }
    else return false;
  }
});
