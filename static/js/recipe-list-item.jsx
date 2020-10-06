var styles = require('./styles.js')

module.exports = React.createClass({
  displayName: "RecipeListItem",
  handleCheckboxClick: function(e) {
    this.props.onSelectedChange(e.target.checked, this.props.recipeid);
  },
  handleRecipeClick: function(e) {
    this.props.onClick(this.props.recipeid);
  },
  render: function() {
    return (
      <div className="collection-item">
        <a href={"#" + this.props.recipeid} onClick={this.handleRecipeClick}>
          {this.props.recipetitle}
        </a>
        <div style={styles.checkbox}>
            <input
              type="checkbox"
              id={"recipe" + this.props.recipeid}
              defaultChecked={this.props.checked}
              onChange={this.handleCheckboxClick} />
          <label htmlFor={"recipe" + this.props.recipeid} />
        </div>
      </div>
    );
  }
});
