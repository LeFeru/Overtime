
class UnlogBox extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        $.ajax({
            url: this.props.signUrl,
            type: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            success: function (response) {
                console.log("7", response);
                checkAuthAndRender("/user/checkauth");
            },
            error: function (error) {
                console.log("8", error);
            }
        })
    }
    render() {
        return <span onClick={this.handleClick} className="navbar-text">
            {this.props.email} (Sign Out)
        </span>
    }
}
var LogBox = React.createClass({
    render: function () {
        return
        <div className="row">
            <div className="col">
                {this.props.children}
            </div>
        </div>
    }
});
class LogForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }
    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        var _email = this.state.email.trim();
        var _password = this.state.password.trim();
        if (!_email || !_password) {
            return;
        }
        console.log("var", _email, _password);
        console.log("9", this.state);
        $.ajax({
            url: this.props.signUrl,
            type: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            data: JSON.stringify({
                email: _email,
                password: _password
            }),
            success: function (response) { // code_html contient le HTML renvoyé
                console.log("10", response);
                checkAuthAndRender("/user/checkauth");
            },
            error: function (error) {
                console.log("11", error);
            }
        })
        this.setState({ email: '', password: '' });
    }
    render() {
        return (
            < form className="form-signin" onSubmit={this.handleSubmit} >
                <h2 className="form-signin-heading">{this.props.info}</h2>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" className="form-control" placeholder="Email address" onChange={this.handleEmailChange} />
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" onChange={this.handlePasswordChange} />
                <button className="btn btn-primary btn-dark" type="submit">{this.props.info}</button>
            </form >
        );
    }
}
var ProjectBox = React.createClass({
    displayName: 'ProjectBox',
    loadProjectsFromServer: function () {
        var self = this;
        $.ajax({
            url: this.props.url,
            type: "GET",
            headers: {
                'Content-type': 'application/json'
            },
            success: function (response) {
                var data = JSON.parse(JSON.stringify(response.result));
                for (var i = 0; i < data.length; i++) {
                    data[i].deadline = moment(data[i].deadline).fromNow();
                }
                self.setState({ data: data });
                return response;
            },
            error: function (error) {
                console.log("ici", error);
            }
        })
    },
    handleProjectSubmit: function (project) {
        var projects = this.state.data;
        var newProjects = projects.concat([project]);
        this.setState({ data: newProjects });
        var self = this;
        console.log(project);
        $.ajax({
            url: this.props.submitUrl,
            data: project,
            type: "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (response) {
                console.log("1", response);
                location.reload();
            },
            error: function (error) {
                console.log("2", error);
            }
        });
    },
    removeProject: function (project) {
        var self = this;
        project.owner = owner;
        $.ajax({
            url: this.props.removeUrl,
            data: project,
            type: "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (response) {
                console.log("1", response);
                location.reload();
            },
            error: function (error) {
                console.log("2", error);
            }
        });
    },
    getInitialState: function () {
        return { data: [] };
    },
    componentDidMount: function () {
        this.loadProjectsFromServer();
    },
    handleAddButton: function () {
        ReactDOM.render(
            <ProjectForm onProjectSubmit={this.handleProjectSubmit} owner={this.props.owner} />,
            document.getElementById("projectform")
        );
    },
    render: function () {
        return (
            <div>
                <ProjectList removeProject={this.removeProject} data={this.state.data} />
                <button type="button" className="btn btn-dark" onClick={this.handleAddButton}>Add</button>
            </div>
        );
    }
});
var Project = React.createClass({
    handleClick: function (e, title) {
        console.log(e.target, title);
        displayTasks(e.target, title);
    },
    removeProject: function (e, project) {
        var project = JSON.parse(JSON.stringify(project));
        delete project.key;
        console.log("remove", e.target, project);
        this.props.removeProject(project);
    },
    render: function () {
        console.log('coucou');

        return (
            <tr onClick={(e) => { this.handleClick(e, this.props.title); }}>
                <td className="text-center" scope="row">{this.props.author}</td>
                <td className="text-center" >{this.props.title}</td>
                <td className="text-center" >{this.props.deadline}</td>
                <td className="text-center" >{this.props.priority}</td>
                <td className="text-center" >{this.props.numberOfTasks}</td>
                <td className="text-center" >{this.props.numberOfTasksCompleted}</td>
                <td className="text-center" ><button type="button" onClick={(e) => { this.removeProject(e, this.props); }} className="btn btn-danger">Delete</button></td>
            </tr>
        );
    }
});
var ProjectList = React.createClass({
    render: function () {
        var self = this;
        var projectNodes = this.props.data.map(function (project) {
            return (
                <Project removeProject={self.props.removeProject} author={project.author} title={project.title} deadline={project.deadline} priority={project.priority} numberOfTasks={project.numberOfTasks} numberOfTasksCompleted={project.numberOfTasksCompleted} key={project.title}>
                </Project>
            );
        });
        return (
            <table className="table table-striped table-dark table-hover">
                <thead className="thead">
                    <tr>
                        <th className="text-center" >Author(s)</th>
                        <th className="text-center" >Title</th>
                        <th className="text-center" >Deadline</th>
                        <th className="text-center" >Priority</th>
                        <th className="text-center" >N# Of Tasks</th>
                        <th className="text-center" >N# Of Tasks Completed</th>
                        <th className="text-center" >Delete</th>
                    </tr>
                </thead>
                <tbody className="projectList">
                    {projectNodes}
                </tbody>
            </table >
        );
    }
});

var ProjectForm = React.createClass({
    getInitialState: function () {
        return { author: '', title: '', deadline: '', priority: '', numberOfTasks: 0, numberOfTasksCompleted: 0 };
    },
    handleAuthorChange: function (e) {
        this.setState({ author: e.target.value });
    },
    handleTitleChange: function (e) {
        this.setState({ title: e.target.value });
    },
    handleDeadlineChange: function (e) {
        this.setState({ deadline: e.target.value });
    },
    handlePriorityChange: function (e) {
        this.setState({ priority: e.target.value });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var owner = this.props.owner
        var author = this.state.author.trim();
        var title = this.state.title.trim();
        var deadline = this.state.deadline.trim();
        var priority = this.state.priority.trim();
        var numberOfTasks = 0;
        var numberOfTasksCompleted = 0;
        if (!priority || !deadline || !title || !author) {
            console.log("Invalid data", this.state);
            return;
        }
        this.props.onProjectSubmit({ Owner: owner, Author: author, Title: title, Deadline: deadline, Priority: priority, NumberOfTasks: numberOfTasks, NumberOfTasksCompleted: numberOfTasksCompleted });
        this.setState({ author: '', title: '', deadline: '', priority: '', numberOfTasks: 0, numberOfTasksCompleted: 0 });
    },
    render: function () {
        return (


            <form className="projectForm" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input type="text" className="form-control" id="author" placeholder="Author" value={this.state.author} onChange={this.handleAuthorChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" placeholder="Title" value={this.state.title} onChange={this.handleTitleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="Deadline">
                        Deadline
    </label>

                    <input
                        type="date"
                        id="Deadline"
                        className="form-control"
                        placeholder="Deadline"
                        value={this.state.deadline}
                        onChange={this.handleDeadlineChange}
                    />

                </div>
                <div className="form-group">
                    <label htmlFor="Priority">
                        Priority
    </label><input
                        type="numeric"
                        id="Priority"
                        className="form-control"
                        placeholder="Priority"
                        value={this.state.priority}
                        onChange={this.handlePriorityChange}
                    /></div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        );
    }
});


var TaskForm = React.createClass({
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
    handleEstimatedTimeChange: function (e) {
        this.setState({ estimatedTime: e.target.value });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var owner = this.props.owner
        var description = this.state.description.trim();
        var title = this.props.title;
        var type = this.state.type.trim();
        var severity = parseInt(this.state.severity.trim());
        var state = "To Do";
        var estimatedTime = this.state.estimatedTime.trim();
        if (!estimatedTime || !severity || !type || !title || !description) {
            return;
        }
        this.props.onTaskSubmit({ Owner: owner, Description: description, Title: title, Type: type, Severity: severity, State: state, EstimatedTime: estimatedTime });
        this.setState({ description: '', title: '', type: '', severity: '', state: '', estimatedTime: '' });
    },
    render: function () {
        return (


            <form className="taskForm" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" className="form-control" id="description" placeholder="Description" value={this.state.description} onChange={this.handleDescriptionChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="Type">
                        Type
    </label>
                    <select className="form-control" id="Type" value={this.state.type} onChange={this.handleTypeChange} id="exampleFormControlSelect1">
                        <option>Architecture</option>
                        <option>Analyse</option>
                        <option>Code</option>
                        <option>Bugfix</option>
                        <option>Clean code</option>
                        <option>Code review</option>
                        <option>Report</option>
                        <option>Submission</option>
                    </select>
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
                    <label htmlFor="EstimatedTime">
                        Estimated Time
    </label><input
                        type="numeric"
                        id="EstimatedTime"
                        className="form-control"
                        placeholder="Estimated Time"
                        value={this.state.estimatedTime}
                        onChange={this.handleEstimatedTimeChange}
                    /></div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        );
    }
});


var TaskBox = React.createClass({
    displayName: 'TaskBox',
    loadTasksFromServer: function () {
        var self = this;
        $.ajax({
            url: this.props.url,
            type: "GET",
            headers: {
                'Content-type': 'application/json'
            },
            success: function (response) {
                var data = JSON.parse(JSON.stringify(response.result));
                self.setState({ data: data });
                return response;
            },
            error: function (error) {
                console.log("ici", error);
            }
        })

    },
    handleTaskSubmit: function (task) {
        var tasks = this.state.data;
        var newTasks = tasks.concat([task]);
        this.setState({ data: newTasks });
        var self = this;
        $.ajax({
            url: this.props.submitUrl,
            data: task,
            type: "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (response) {
                console.log("1", response);
                self.loadTasksFromServer();
            },
            error: function (error) {
                console.log("2", error);
            }
        });
    },
    removeTask: function (task) {
        var self = this;
        $.ajax({
            url: this.props.removeUrl,
            data: task,
            type: "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (response) {
                console.log("1", response);
                self.loadTasksFromServer();
            },
            error: function (error) {
                console.log("2", error);
            }
        });
    },
    closeTask: function (task) {
        var self = this;
        $.ajax({
            url: this.props.closeUrl,
            data: task,
            type: "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (response) {
                console.log("1", response);
                self.loadTasksFromServer();
            },
            error: function (error) {
                console.log("2", error);
            }
        });
    },
    getInitialState: function () {
        return { data: [] };
    },
    componentDidMount: function () {
        this.loadTasksFromServer();
    },
    handleAddButton: function () {
        ReactDOM.render(
            <TaskForm onTaskSubmit={this.handleTaskSubmit} title={this.props.title} owner={this.props.owner} />,
            document.getElementById("taskform")
        );
    },
    render: function () {
        return (
            <div>
                <TaskList removeTask={this.removeTask} closeTask={this.closeTask} data={this.state.data} />
                <button type="button" className="btn btn-dark" onClick={this.handleAddButton}>Add</button>
            </div>
        );
    }
});
var Task = React.createClass({
    removeTask: function (e, task) {
        var task = JSON.parse(JSON.stringify(task));
        delete task.key;
        console.log("remove", e.target, task);
        this.props.removeTask(task);
    },
    closeTask: function (e, task) {
        var task = JSON.parse(JSON.stringify(task));
        delete task.key;
        console.log("close", e.target, task);
        this.props.closeTask(task);
    },
    render: function () {
        console.log('coucou');
        var isDone;
        if (this.props.state === "To Do") {
            isDone = <td className="text-center"><button type="button" onClick={(e) => { this.closeTask(e, this.props); }} className="btn btn-success">Done</button></td>
        }
        else {
            isDone = <td />
        }
        return (
            <tr>
                <td className="text-center" scope="row">{this.props.owner}</td>
                <td className="text-center" >{this.props.title}</td>
                <td className="text-center" >{this.props.description}</td>
                <td className="text-center" >{this.props.type}</td>
                <td className="text-center" >{this.props.severity}</td>
                <td className="text-center" >{this.props.state}</td>
                <td className="text-center" >{this.props.estimatedTime}</td>
                <td className="text-center" ><button type="button" onClick={(e) => { this.removeTask(e, this.props); }} className="btn btn-danger">Delete</button></td>
                {isDone}
            </tr>
        );
    }
});
var TaskList = React.createClass({
    render: function () {
        var self = this;
        var taskNodes = this.props.data.map(function (task) {
            return (
                <Task closeTask={self.props.closeTask} removeTask={self.props.removeTask} owner={task.owner} title={task.title} description={task.description} type={task.type} severity={task.severity} state={task.state} estimatedTime={task.estimatedTime} key={task.description}>
                </Task>
            );
        });
        return (
            <table className="table table-striped table-dark table-hover">
                <thead className="thead">
                    <tr>
                        <th className="text-center" >Owner</th>
                        <th className="text-center" >Title</th>
                        <th className="text-center" >Description</th>
                        <th className="text-center" >Type</th>
                        <th className="text-center" >Severity</th>
                        <th className="text-center" >State</th>
                        <th className="text-center" >Estimated Time</th>
                        <th className="text-center" >Delete</th>
                        <th className="text-center" >Done</th>
                    </tr>
                </thead>
                <tbody className="taskList">
                    {taskNodes}
                </tbody>
            </table >
        );
    }
});

function displayTasks(target, title) {
    document.getElementById('UnlogBox').style.display = "block";
    document.getElementById('tasks').style.display = "block";
    document.getElementById('projects').style.display = "none";
    document.getElementById('sign').style.display = "none";

    ReactDOM.render(
        <TaskBox closeUrl="/tasks/done" removeUrl={"/tasks/remove"} url={"/tasks?title=" + title} title={title} submitUrl="/tasks/new" owner={owner} pollInterval={200000} />,
        document.getElementById('tasks')
    );
}
var owner;
function checkAuthAndRender(authUrl) {
    $.ajax({
        url: authUrl,
        type: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        success: function (response) {
            console.log("3", response == "ko");
            if (response == "ko") {
                document.getElementById('UnlogBox').style.display = "none";
                document.getElementById('projects').style.display = "none";
                document.getElementById('sign').style.display = "block";
                document.getElementById('tasks').style.display = "none";
                ReactDOM.render(
                    <div className="row">
                        <div className="col">
                            <LogForm signUrl="/user/signin" info="Sign In" />
                        </div>
                        <div className="col">
                            <LogForm signUrl="/user/signup" info="Sign Up" />
                        </div>
                    </div>,
                    document.getElementById('sign')
                );
                return true;
            }
            else {
                owner = JSON.parse(response).email;
                document.getElementById('UnlogBox').style.display = "block";
                document.getElementById('projects').style.display = "block";
                document.getElementById('sign').style.display = "none";
                document.getElementById('tasks').style.display = "none";
                console.log("4", response);
                var email = owner;
                console.log("5", email);
                ReactDOM.render(
                    <UnlogBox email={email} signUrl="/user/signout" />,
                    document.getElementById("UnlogBox")
                );
                console.log("6", "izi");
                ReactDOM.render(
                    <ProjectBox removeUrl="/projects/remove" url="/projects" submitUrl="/projects/new" owner={owner} pollInterval={200000} />,
                    document.getElementById('projects')
                );
                return false;
            }
        },
        error: function (error) {
            console.log("13", error);
            return false;
        }
    })

}

checkAuthAndRender("/user/checkauth");
