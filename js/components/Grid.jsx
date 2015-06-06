var React = require('react');
var Model = require('./Model.jsx');

var Grid = React.createClass({
    render: function() {

        var items = this.props.models.map(function(model){
            return <Model key={model.urlid} model={model} mouseOverHandler={this.props.mouseOverHandler} clickHandler={this.props.clickHandler}></Model>
        }.bind(this));

        return (
            <div>
                <ul className="grid">
                    {items}
                </ul>
                <div style={{padding: '10px', clear: 'both', textAlign: 'center'}}>
                    <button onClick={this.props.loadMoreHandler}>Load more</button>
                </div>
            </div>
        );
    }
});

module.exports = Grid;
