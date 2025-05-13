import Button from "./components/Button"
import Card from "./components/Card"
import { PlusIcon } from "./Icons/PlusIcon"
function App() {


  return (
    <>
     <Button variant="primary" size={true} text="Add Content" startIcon={<PlusIcon/>} />
     <Card title="Card1" type="twitter" link=""/>
    </>
  )
}

export default App
