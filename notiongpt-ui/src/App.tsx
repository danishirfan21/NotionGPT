import ChatContainer from './components/Chat/ChatContainer';
import BlockEditor from './components/Editor/BlockEditor';

function App() {
  return (
    <div className="h-screen w-screen grid grid-cols-2 bg-gray-100">
      <div className="border-r flex justify-center items-center">
        <ChatContainer />
      </div>
      <BlockEditor />
    </div>
  );
}

export default App;
