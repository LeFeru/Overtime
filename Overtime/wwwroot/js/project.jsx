
var ProjectForm = React.createClass({
    getInitialState: function () {
        return { description: '', title: '', type: '', severity: '', state: '', estimatedTime: '' };
    },
    handleDescriptionChange: function (e) {
        this.setState({ description: e.target.value });
    },
    handleTitleChange: function (e) {
        this.setState({ title: e.target.value });
    },
    handleTypeChange: function (e) {
        this.setState({ type: e.target.value });
    },
    handleSeverityChange: function (e) {
        this.setState({ severity: e.target.value });
    },
    handleStateChange: function (e) {
        this.setState({ state: e.target.value });
    },
    handleEstimatedTimeChange: function (e) {
        this.setState({ estimatedTime: e.target.value });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var owner = this.props.owner
        var description = this.state.description.trim();
        var title = this.state.title.trim();
        var type = this.state.type.trim();
        var severity = parseInt(this.state.severity.trim());
        var state = parseInt(this.state.state.trim());
        var estimatedTime = parseInt(this.state.estimatedTime.trim());
        if (!estimatedTime || !state || !severity || !type || !title || !description) {
            return;
        }
        this.props.onProjectSubmit({Owner:owner, Description: description, Title: title, Type: type, Severity: severity, State: state, EstimatedTime: estimatedTime });
        this.setState({ description: '', title: '', type: '', severity: '', state: '', estimatedTime: '' });
    },
    render: function () {
        return (
         

            <form className="projectForm" onSubmit={this.handleSubmit}>
                  <div className="form-group">
    <label htmlFor="description">Description</label>
    <input type="text" className="form-control" id="description" placeholder="Description" value={this.state.description} onChange={this.handleDescriptionChange}/>
  </div>
  <div className="form-group">
    <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" id="title" placeholder="Title" value={this.state.title} onChange={this.handleTitleChange} />
  </div>
  <div className="form-group">
    <label htmlFor="Type">
    Type
    </label>
                    <input
                    type="text"
                        id="Type"
                        className="form-control"
                    placeholder="Type"
                    value={this.state.type}
                    onChange={this.handleTypeChange}
                />
  </div>
                <div className="form-group">
    <label htmlFor="Severity">
    Severity
    </label><input
                    type="numeric"
                        id="Severity"
                        className="form-control"
                    placeholder="Severity"
                    value={this.state.severity}
                    onChange={this.handleSeverityChange}
                /></div>
                <div className="form-group">
    <label htmlFor="State">
    Number of tasks
    </label><input
                    type="numeric"
                        id="State"
                        className="form-control"
                    placeholder="Number of tasks"
                    value={this.state.state}
                    onChange={this.handleStateChange}
                /></div>
                 <div className="form-group">
    <label htmlFor="EstimatedTime">
    Number of tasks completed
    </label><input
                    type="numeric"
                        id="EstimatedTime"
                        className="form-control"
                    placeholder="Number of tasks completed"
                    value={this.state.estimatedTime}
                    onChange={this.handleEstimatedTimeChange}
                /></div>
  <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        );
    }
});
