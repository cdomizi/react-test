import Button from '@mui/material/Button';

function App() {
  return (
    <div className="App">
      <Button
        variant="contained"
        onClick={() => console.log("test")}
      >
        Hello World</Button>
    </div>
  );
}

export default App;
