var React = require('react');
var Model = require('./Model.jsx');

var Grid = React.createClass({
    render: function() {

        var items = this.props.models.map(function(model){
            return <Model key={model.urlid} model={model} mouseOverHandler={this.props.mouseOverHandler}></Model>
        }.bind(this));

        return (
            <ul className="grid">
                {items}
            </ul>
        );
    }
});

module.exports = Grid;
