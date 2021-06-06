import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { studentService, showService } from './services';
import { Alert, Card, Row, Column, NavBar, Button, Form } from './widgets';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <NavBar brand="TVAdm">
        <NavBar.Link to="/shows">TV Shows</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return <Card title="Welcome">Welcome to TV Central</Card>;
  }
}

class TVList extends Component {
  shows = [];

  render() {
    return (
      <div>
        <Card title="Shows">
          {this.shows.map((show) => (
            <Row key={show.id}>
              <Column>
                <NavLink to={'/shows/' + show.id}>{show.title}</NavLink>
              </Column>
              <Column>{show.description}</Column>
            </Row>
          ))}
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.add}>Add new show</Button.Success>
          </Column>
        </Row>
      </div>
    );
  }
  mounted() {
    showService.getShows((shows) => {
      this.shows = shows;
    });
  }
  add() {
    history.push('/shows/new');
  }
}

class TVDetails extends Component {
  show = null;
  showRatings = [];

  render() {
    if (!this.show) return null;

    return (
      <div>
        <Card title="TV show details">
          <Row>
            <Column width={3}>Title:</Column>
            <Column>{this.show.title}</Column>
          </Row>
          <Row>
            <Column width={3}>Description:</Column>
            <Column>{this.show.description}</Column>
          </Row>
          {/*
          <Row>
            <Column width={2}>Reviews:</Column>
            <Column>
              {this.showRatings.map((showRating) => (
                <div key={showRating.id}>{showRating.rating}</div>
              ))}
            </Column>
          </Row>
            */}
          <Row>
            <Column width={4}>Average Rating:</Column>
            <Column>
              {this.showRatings
                .reduce(
                  (average, showRating, _index, showRatings) =>
                    average + showRating.rating / showRatings.length,
                  0
                )
                .toFixed(1)}
            </Column>
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.edit}>Rate this show</Button.Success>
          </Column>
        </Row>
      </div>
    );
  }

  mounted() {
    showService.getShow(this.props.match.params.id, (show) => {
      this.show = show;
    });
    showService.getRatings(this.props.match.params.id, (ratings) => {
      this.showRatings = ratings;
    });
  }

  edit() {
    history.push('/shows/' + this.show.id + '/edit');
  }
}

class TVEdit extends Component {
  show = null;
  myRating = 0;

  render() {
    if (!this.show) return null;

    return (
      <div>
        <Card title="Rate TV Show">
          <Row>
            <Column width={3}>Title:</Column>
            <Column>{this.show.title}</Column>
          </Row>
          <Row>
            <Column width={3}>Description:</Column>
            <Column>{this.show.description}</Column>
          </Row>
          <Row>
            <Column width={3}>
              <Form.Label>Your rating:</Form.Label>{' '}
            </Column>
            <Column>
              <input
                type="number"
                min="0"
                max="5"
                onChange={(event) => (this.myRating = event.currentTarget.value)}
              />
            </Column>
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.rateShow}>Add my rating</Button.Success>
          </Column>
        </Row>
      </div>
    );
  }
  mounted() {
    showService.getShow(this.props.match.params.id, (show) => {
      this.show = show;
    });
  }
  rateShow() {
    console.log(this.myRating);
    showService.addRating(this.show.id, this.myRating, () => {
      history.push('/shows');
    });
  }
}

class TVNew extends Component {
  show = [];
  render() {
    return (
      <div>
        <Card title="New TV Show">
          <Row>
            <Column width={3}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                onChange={(event) => (this.show.title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={3}>
              <Form.Label>Description:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                onChange={(event) => (this.show.description = event.currentTarget.value)}
              />
            </Column>
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.save}>Save new show</Button.Success>
          </Column>
        </Row>
      </div>
    );
  }
  save() {
    showService.saveNewShow(this.show, () => {
      history.push('/shows');
    });
  }
}

class StudentEdit extends Component {
  student = null;

  render() {
    if (!this.student) return null;

    return (
      <div>
        <Card title="Edit student">
          <Form.Label>Name:</Form.Label>
          <Form.Input
            type="text"
            value={this.student.name}
            onChange={(event) => (this.student.name = event.currentTarget.value)}
          />
          <Form.Label>Email:</Form.Label>
          <Form.Input
            type="text"
            value={this.student.email}
            onChange={(event) => (this.student.email = event.currentTarget.value)}
          />
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.save}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Light onClick={this.cancel}>Cancel</Button.Light>
          </Column>
        </Row>
      </div>
    );
  }

  mounted() {
    studentService.getStudent(this.props.match.params.id, (student) => {
      this.student = student;
    });
  }

  save() {
    studentService.updateStudent(this.student, () => {
      history.push('/students/' + this.props.match.params.id);
    });
  }

  cancel() {
    history.push('/students/' + this.props.match.params.id);
  }
}

ReactDOM.render(
  <div>
    <Alert />
    <HashRouter>
      <div>
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/shows" component={TVList} />
        <Route exact path="/shows/:id" component={TVDetails} />
        <Route exact path="/shows/:id/edit" component={TVEdit} />
        <Route exact path="/shows/new" component={TVNew} />
      </div>
    </HashRouter>
  </div>,
  document.getElementById('root')
);
