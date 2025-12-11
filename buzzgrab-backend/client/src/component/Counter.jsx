const Counter = ({ icon, number, label }) => {
    return (
      <div className="counter">
        <div className="icon">{icon}</div>
  
        <div className="counter-content">
          <h5>{number}</h5>
          <p>{label}</p>
        </div>
      </div>
    );
  };
  
  export default Counter;
  