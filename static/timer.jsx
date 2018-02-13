'use strict';

class ActivitiesContainer extends React.Component {
    startActivities() {
        alert('Working!!')
    }

    render() {
        let activities = [];
        // debugger;
        for (let activity in this.props.data) {
            let current_activity = this.props.data[activity];
            activities.push(<Activity id={activity} name={current_activity[0]}
                            time={current_activity[1]} />)
        }
        return <div>
        <button onClick={this.startActivities} type='button' id='start'>Start</button>
        {activities}
        <div>ETA</div>
        </div>;
    }


    // timer(time) {
    //     interval = setInterval(function () {
    //     { this.time };
    //     time -= 1;
    //     }, 1000);
    // }
}

class Activity extends React.Component {
    render() {
        debugger;
        return <div><span> {this.props.name}</span> <span> {this.props.time}</span></div>
    }
}
