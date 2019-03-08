class CalculatorComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        display: 0,
        formula: ""
      }
      this.handleOnClick = this.handleOnClick.bind(this);
      this.isNumber = this.isNumber.bind(this);
      this.isDigit = this.isDigit.bind(this);
      this.isOperation = this.isOperation.bind(this);
    }
   
    
    isOperation(cadena){
      return /[-+/x]/.test(cadena);
    }
    
    isNumber(cadena){
      return /^-{0,1}[.\d]+$/.test(cadena);
    }
    
    isDigit(cadena){
      return /^-{0,1}\d+$/.test(cadena);
    }
    
    handleOnClick(e){
      let buttonPressed = $("#"+e.target.id).text();
      let element = $("#"+e.target.id);
      let new_display = "";
      let current_display = this.state.display;
      let new_formula = "";
      let current_formula = this.state.formula;
  
      //introducimos varios digitos
      if(this.isDigit(buttonPressed) && this.isNumber(current_display) && current_display.toString().length < 10){
        new_display = (current_display == "0" ? "" : current_display) + buttonPressed;
        new_formula = current_formula;
      }
      
      //introducimos un nuevo número tras una operacion
      else if(this.isNumber(buttonPressed) && this.isOperation(current_display)){
        new_formula = current_formula + current_display;
        new_display = buttonPressed;
      }
      
      //introducimos operacion
      else if(this.isOperation(buttonPressed)){
        //si hemos marcado una operacion y volvemos a marcar otra, nos quedamos con la última.
        if(this.isOperation(current_display)){
          new_formula = current_formula;
          new_display = buttonPressed;
        }
        else if(!current_formula.includes("=")){
          new_formula = current_formula + current_display;
          new_display = buttonPressed;
        }
        else{
          new_formula = current_display;
          new_display = buttonPressed;
        }
      }
      
      //punto decimal
      else if(buttonPressed == "."){
        if(current_display.includes(".")){
          new_display = current_display;
          new_formula = current_formula;
        }
        else{
          current_display = current_display + ".";
          new_display = current_display;
          new_formula = current_formula;
        }      
      }
      
      //ponemos a cero
      else if(buttonPressed == "AC"){
        new_formula = "";
        new_display = 0;
      }
      
      //borramos digito
      else if(buttonPressed == "ATRÁS" && this.isNumber(current_display) && current_display.length > 0){
        new_formula = current_formula;
        new_display = current_display.substr(0, current_display.length-1);
        console.log(new_display);
        if(new_display == "") new_display = "0";
      }
      
      //pedimos calcular
      else if(buttonPressed == "=" && this.isNumber(current_display)){
        if(!current_formula.includes("=")){
          current_formula = current_formula + current_display;
          let regex = /x/g;
          current_formula = current_formula.replace(regex, "*");
          console.log(current_formula);
          //limitamos a 10 digitos la precision
          new_display = parseFloat(eval(current_formula).toFixed(10));
          new_formula = current_formula + "=" + new_display;
        }
        else{
          new_display = current_display;
          new_formula = current_formula;
        }     
      }
      
      else{
        new_display = current_display;
        new_formula = current_formula;
      }
      
      this.setState({
        display: new_display,
        formula: new_formula,
      });
    }
    
    render(){
      return(
        <div class="container-flex">
          <div class="row align-items-center justify-content-center">
            <div class="col-3">
              <div id="calculator">
                <ScreenComponent display={this.state.display} formula={this.state.formula}/>
                <KeyboardComponent onClick={this.handleOnClick} />
              </div>
            </div>
          </div>
        </div>
      );
    }
    
  }
  
  
  class ScreenComponent extends React.Component{
    constructor(props){
      super(props);
    }
    
    render(){
      return(
        <div id="screen">
          <div id="formula">{this.props.formula}</div>
          <div id="display">{this.props.display}</div>
        </div>
      );
    }
    
  }
  
  class KeyboardComponent extends React.Component{
    constructor(props){
      super(props);
    }
    
    render(){
      return(
        <div id="keyboard">
          <div class="row">
            <div class="col-6"><KeyComponent onClick={this.props.onClick} label="ATRÁS" id="back" /></div>
            <div class="col-6"><KeyComponent onClick={this.props.onClick} label="AC" id="clear" /></div>
          </div>
          
          <div class="row">
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="7" id="seven" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="8" id="eight" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="9" id="nine" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="/" id="divide" /></div>
          </div>
          
          <div class="row">
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="4" id="four" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="5" id="five" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="6" id="six" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="x" id="multiply" /></div>
          </div>
          
          <div class="row">
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="1" id="one" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="2" id="two" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="3" id="three" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="-" id="subtract" /></div>
          </div>
          
          <div class="row">
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="0" id="zero" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="." id="decimal" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="=" id="equals" /></div>
            <div class="col-3"><KeyComponent onClick={this.props.onClick} label="+" id="add" /></div>
          </div>        
        </div>
      );
    }
    
  }
  
  class KeyComponent extends React.Component{
    constructor(props){
      super(props);
    }
    
    render(){
      return(
        <button class="key" onClick={this.props.onClick} id={this.props.id}>
          {this.props.label}
        </button>
      );
    }
    
  }
  
  ReactDOM.render(<CalculatorComponent />, document.getElementById("app"));