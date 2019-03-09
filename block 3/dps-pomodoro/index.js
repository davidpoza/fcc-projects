const defaults = {
  break: 5*60,
  session: 25*60,
  work_label: "A trabajar!",
  break_label: "Una pausa..."
};

const initial_state = {
  break_length: defaults.break, //segundos
  session_length: defaults.session, //segundos
  label: defaults.work_label,
  time_left: defaults.session, //segundos
  paused: true,
  mode: "work", //work or break
}

class ClockComponent extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = Object.assign({},initial_state); //queremos una copia del objeto inicial
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(e){
    switch(e.currentTarget.id){
        case "break-increment":
          if(this.state.break_length<60*60 && this.state.paused)
          this.setState({
            break_length: this.state.break_length+60            
          });
          break;
        case "break-decrement":
          if(this.state.break_length>1*60 && this.state.paused)
          this.setState({
            break_length: this.state.break_length-60
          });
          break;
        case "session-increment":
          if(this.state.session_length<60*60 && this.state.paused)
          this.setState({
            session_length: this.state.session_length+60,
            time_left: this.state.session_length+60
          });
          break;
        case "session-decrement":
          if(this.state.session_length>1*60 && this.state.paused)
          this.setState({
            session_length: this.state.session_length-60,
            time_left: this.state.session_length-60
          });
          break;
        case "start_stop":
          this.setState({
            paused: this.state.paused ? false : true
          });
          this.state.paused ? this.state.paused=false : this.state.paused=true;
          if(this.timer == null) //no queremos crear un timer nuevo cada vez
            this.timer = setInterval(()=>{
              if(!this.state.paused && this.state.time_left >= 1){
                this.setState({
                  time_left: this.state.time_left-1
                });
              }
              else if(this.state.time_left == 0){ 
                //suena la alarma
                let audio = document.getElementById("beep");
                audio.play();
                
                
                //vamos alternando entre periodos trabajo-pausa
                if(this.state.mode == "work"){
                  this.setState({
                    mode: "break",
                    label: defaults.break_label,
                    time_left: this.state.break_length
                  });
                }
                else{
                  this.setState({
                    mode: "work",
                    label: defaults.work_label,
                    time_left: this.state.session_length
                  });
                }
              }
            }, 1000);
          
          break;
        case "reset":
          let audio = document.getElementById("beep");
          audio.pause();
          audio.currentTime = 0;
        
          if(this.timer != null){
            clearInterval(this.timer);
            this.timer = null;
          }
          
          //queremos una copia del objeto initial_state
          this.setState(Object.assign({},initial_state)); 
          break;
    }
  }
  
  render() {
    return (
      <div class="container-flex">
        <div class="row align-items-center justify-content-center">
          <div class="col-5">
            <div id="clock">
              <h1>DpsPomodoro</h1>
              <div class="row">
                <div class="col-6 ">
                  <ParamControlComponent value={this.state.break_length} onClick={this.handleOnClick} control_name="break" label="Duración de la pausa" />
                </div>
                <div class="col-6">
                  <ParamControlComponent value={this.state.session_length} onClick={this.handleOnClick} control_name="session" label="Duración de la sesión" />
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <DisplayComponent label={this.state.label} time={this.state.time_left}/>
                </div>
              </div>
              <div class="row justify-content-center">
                <div class="col-1">
                  <PlayControlComponent id="start_stop" icon={this.state.paused ? "play" : "pause"} onClick={this.handleOnClick} />
                </div>
                <div class="col-1">
                  <PlayControlComponent id="reset" icon="recycle" onClick={this.handleOnClick} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ParamControlComponent extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <div id={this.props.control_name} class="control">
        <div id={this.props.control_name + "-label"}>
          {this.props.label}
        </div>
        <button id={this.props.control_name + "-decrement"} onClick={this.props.onClick}><i class="fas fa-arrow-down"></i></button>
        <div id={this.props.control_name + "-length"}>{this.props.value / 60}</div>
        <button id={this.props.control_name + "-increment"} onClick={this.props.onClick}><i class="fas fa-arrow-up"></i></button>
      </div>
    );    
  }
}

class PlayControlComponent extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <button id={this.props.id} onClick={this.props.onClick}>
        <i class={"fas fa-"+this.props.icon}></i>
      </button>
    );    
  }
}


class DisplayComponent extends React.Component{
  constructor(props){
    super(props);
  }
  
  formatTime(total_sec){
    let min = Math.trunc(total_sec / 60);
    let sec = total_sec % 60;
    
    if(min.toString().length == 1)
        min = "0" + min;
    
    if(sec.toString().length == 1)
        sec = "0" + sec;
    
    return (min+":"+sec);
  }
  
  render(){
    return(
      <div id="display">
        <div id="timer-label">
          {this.props.label}
        </div>
        <div id="time-left">
          {this.formatTime(this.props.time)}
        </div>
      </div>
    );    
  }
}


ReactDOM.render(<ClockComponent />, document.getElementById("app"));
