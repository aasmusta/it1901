import React, { Component } from 'react';
import NavComponent from '../../components/navbar/navbar'

import './style.css';

import Technician from '../../components/technician/Technician'
import Concert from '../../components/concert/Concert'

//Firebase
import database from '../../database'

export default class AdminPage extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}
  constructor(props) {
    super(props);

    this.state = {
      concertsForTechnician: [],
      technicians: [],

      // Technician form
      currentTechnicianConcert: "",
      currentTechnicianNameInput: "",
      currentTechnicianIdInput: "",

      // Concert form
      currentConcertNameInput: "",
      currentConcertGenreInput: "",
      currentConcertInput: "",
      currentConcertPriceInput: "",
      currentConcertDayInput: "",
    }

    this.match = "";
    this.handleChange = this.handleChange.bind(this);
    this.pushTech = this.pushTech.bind(this);
    this.handleSubmitTech = this.handleSubmitTech.bind(this);
    this.handleSubmitConcert = this.handleSubmitConcert.bind(this);
    this.searchConcertsFor = this.searchConcertsFor.bind(this);
  }

  componentWillMount() {
    var previousTechnicians = this.state.technicians;

    database.ref('festival17').child('technicians').on('child_added', techSnapshot => {
      var val = techSnapshot.val();
      previousTechnicians.push({
        name: val.name,
        id: techSnapshot.key,
      })
      this.setState({
        technicians: previousTechnicians,
        currentTechnicianConcert: "",
        currentTechnicianNameInput: "",
        currentTechnicianIdInput: ""
      })
    })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  pushTech(e) {
    e.preventDefault();
    this.searchConcertsFor("name", this.state.currentTechnicianConcert)
    .then(() => {
      database.ref("festival17").child('concerts').child(this.match.key).child('technicians').child(this.state.currentTechnicianIdInput).set({
        name: this.state.currentTechnicianNameInput,
      })
    })
  }

  handleSubmitTech(e) {
    e.preventDefault();
    database.ref("festival17").child('technicians').child(this.state.currentTechnicianIdInput).set({
      name: this.state.currentTechnicianNameInput
    })
  }

  handleSubmitConcert(e) {
    e.preventDefault();
    var data = {
      name: this.state.currentConcertNameInput,
      day: this.state.currentConcertDayInput
    }
    database.ref('festival17').child('concerts').push({
      name: this.state.currentConcertNameInput,
      day: this.state.currentConcertDayInput,
    })
  }

  searchConcertsFor(query, value) {
    return database.ref('festival17').child('concerts').once('value').then(concertsSnapshot => {
      return concertsSnapshot.forEach(concertSnapshot => {
        if (concertSnapshot.val()[query] == value) {
          this.match = concertSnapshot;
          console.log(this.match);
        }
      })
    })
  }


  render() {
    return (
      <div className="App">
        <NavComponent />
        <h1>
          AdminPage
        </h1>

        <p> Dette er en haug med former for å legge til forskjellige ting i databasen </p>

        <form>
          <h3> Denne formen er for å pushe en tekniker inn i databasen </h3>
          <input name="currentTechnicianNameInput" type="text" value={this.state.currentTechnicianNameInput} onChange={this.handleChange} placeholder="Technician Name" />
          <input name="currentTechnicianIdInput" type="number" value={this.state.currentTechnicianIdInput} onChange={this.handleChange} placeholder="id" />
          <button onClick={this.handleSubmitTech}>Pushit</button>
        </form>

        <form>
          <h3> Denne formen er for å pushe en tekniker inn i konserten </h3>
          <input name="currentTechnicianNameInput" type="text" value={this.state.currentTechnicianNameInput} onChange={this.handleChange} placeholder="Technician Name" />
          <input name="currentTechnicianIdInput" type="number" value={this.state.currentTechnicianIdInput} onChange={this.handleChange} placeholder="id" />
          <input name="currentTechnicianConcert" type="text" value={this.state.currentTechnicianConcert} onChange={this.handleChange} placeholder="Concert Name" />
          <button onClick={this.pushTech}>Pushit</button>
        </form>

        <form>
          <h3> Denne formen er for å pushe en konsert inn i databasen </h3>
          <input type="text" name="currentConcertNameInput" placeholder="Name" value={this.state.currentConcertNameInput} onChange={this.handleChange}/>
          <input type="text" name="currentConcertGenreInput" placeholder="Genre" value={this.state.currentConcertGenreInput} onChange={this.handleChange}/>
          <input type="number" name="currentConcertPriceInput" placeholder="Price" value={this.state.currentConcertPriceInput} onChange={this.handleChange}/>
          <select name="currentConcertDayInput" onChange={this.handleChange}>
            <option value="day1">Dag 1</option>
            <option value="day2">Dag 2</option>
            <option value="day3">Dag 3</option>
            <option value="day4">Dag 4</option>
            <option value="day5">Dag 5</option>
            <option value="day6">Dag 6</option>
            <option value="day7">Dag 7</option>
          </select>
          <button onClick={this.handleSubmitConcert}> Pushit</button>
        </form>

        <div>
          <h1> Concerts for [feature coming soon] </h1> 
          {
            this.state.concertsForTechnician.map((concert) => {
              return (
                <Concert name={concert.name}/>
              )
            })
          }
        </div>

        <div>
          <h1> Technicians found in database </h1>
          {
            this.state.technicians.map((technician) => {
              return (
                <Technician name={technician.name} id={technician.id} key={technician.id} />
              )
            })
          }
        </div>
      </div>
    );
  }
}