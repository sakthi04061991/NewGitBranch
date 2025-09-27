import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  const [mybranch, setMybranch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [diffFiles, setDiffFiles] = useState([]);
  const [addedFiles, setAddedFiles] = useState([]);
  const [commitMsg, setCommitMsg] = useState("");
  const togglePopup = () => {
    setShowPopup((prev) => !prev); // toggles true/false
  };
  const getCurrentBranch = async () => {
    try {
      await axios
        .get(`http://localhost:5001/`)
        .then((res) => {
          if (res.data.branch) {
            setMybranch(res.data.branch);
          } else {
            setMybranch("");
          }
        })
        .catch((err) => {
          setMybranch("");
          console.log(err.message);
        });
    } catch (e) {
      console.log(`getBranch Error`);
    }
  };

  useEffect(() => {
    getCurrentBranch();
  }, [mybranch]);

  const handleClick = (create) => {
    setPopupTitle(create);
    togglePopup();
  };
  const handleSubmit = async (e) => {
    if (!inputValue) {
      setErrorInput("This is required");
      return;
    }
    try {
      if (popupTitle === "Create New Branch") {
        const res = await axios.post("http://localhost:5001/createbranch", {
          branchName: inputValue,
        });
        alert(res.data.message);
        setErrorInput("");
        setInputValue("");
        setShowPopup(false);
        setMybranch(inputValue);
      }
      if (popupTitle === "Change Branch") {
        const res = await axios.post("http://localhost:5001/changebranch", {
          branchName: inputValue,
        });
        alert(res.data.message);
        setErrorInput("");
        setInputValue("");
        setShowPopup(false);
        setMybranch(inputValue);
      }
	  if(popupTitle === "Commit Your Changes")
	  {
		const res = await axios.post("http://localhost:5001/gitcommit", {
			message: inputValue,
		});
		alert(res.data.message);
        setErrorInput("");
        setInputValue("");
        setShowPopup(false);
	  }
    } catch (err) {
		console.log(err)
		if (err.response.data.error) {
			setErrorInput(err.response.data.error);
		}
      else if (err.response.data.err) {
        setErrorInput(err.response.data.err);
      } else {
        setErrorInput(err.message);
      }
    }
  };
  const getDiff = async () => {
	setAddedFiles([]);
    try {
      const res = await axios.post("http://localhost:5001/gitdiff", {
        filepath: "",
      });
	  setDiffFiles(res.data.diffFiles);
    } catch (err) {
      setDiffFiles(["Error fetching diff"]);
    }
  };
  const getFilePath = (diffText) => {
    const firstLine = diffText.split("\n")[0]; // e.g., diff --git a/index.php b/index.php
    const parts = firstLine.split(" ");
    if (parts.length >= 4) {
      return parts[2].replace("a/", ""); // original file path
    }
    return "unknown";
  };
  const gitadd = async (filePath) => {
    try {
      const res = await axios.post("http://localhost:5001/gitadd", {
        filepath:filePath,
      });
      setAddedFiles((prev) => [...prev, filePath]);
      alert(res.message || "File added successfully");
    } catch (err) {
      alert("Error adding file");
    }
  };
  const addcheckout = async (filePath) => {
    try {
      const res = await axios.post("http://localhost:5001/gitcheckout", {
		branchName:filePath
      });
      setAddedFiles((prev) => [...prev, filePath]);
      alert(res.message || "Checkouted successfully");
    } catch (err) {
      alert("Error adding file");
    }
  };
  const PushBranch = async () => {
    try {
      const res = await axios.post("http://localhost:5001/gitpush");
	  console.log(res)
      const data = await res.json();
      alert(data.message || "File added successfully");
    } 
    catch (err) {
		if (err.response.data.error) {
			alert(err.response.data.error);
		}
		else{
			alert(err.message);
		}
    }
  }
  return (
    <div className="container-fluid py-3">
      <h2>
        My Current Branch is: <b>{mybranch}</b>
      </h2>
      <div className="d-flex gap-2">
        <button
          type="button"
          onClick={() => getCurrentBranch()}
          className="btn btn-outline-info"
        >
          My Branch
        </button>
        <button
          type="button"
          onClick={() => handleClick("Create New Branch")}
          className="btn btn-outline-success"
        >
          Create New branch
        </button>
        <button
          type="button"
          onClick={() => handleClick("Change Branch")}
          className="btn btn-outline-primary"
        >
          Change branch
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => getDiff()}
        >
          Show your changes
        </button>
		
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => handleClick("Commit Your Changes")}
        >
          Commit Your Changes
        </button>
		<button
          type="button"
          className="btn btn-outline-info"
          onClick={() => PushBranch()}
        >
          Push branch (HEAD)
        </button>
      </div>
      {showPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div
            className="bg-white p-4 rounded shadow-lg text-center"
            style={{ width: "35%" }}
          >
            <h5>{popupTitle}</h5>
            <input
              type="text"
              className="form-control my-2"
              placeholder="Type here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {errorInput && <span style={{ color: "red" }}>{errorInput}</span>}
            <div className="mt-2">
              <button className="btn btn-primary me-2" onClick={handleSubmit}>
                Submit
              </button>
              <button className="btn btn-secondary" onClick={togglePopup}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
	  <div className="space-y-4">
        {diffFiles.length > 0 &&
          diffFiles.map((fileDiff, idx) => {
            const filePath = getFilePath(fileDiff);
            if (addedFiles.includes(filePath)) return null;
            return (
              <div key={idx}  className="bg-black text-green-400 mt-4 p-4 rounded">
                <div className="customfilepath">
                  <span className="customfilepath_title">{filePath}</span>
                  <button
                    className="btn btn-success m-1"
                    onClick={() => gitadd(filePath)}
                  >
                    Add
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => addcheckout(filePath)}
                  >
                    checkout
                  </button>
                </div>
                {/* <textarea
                  className="textarea"
                  value={fileDiff}
                  readOnly
                /> */}
                 {/* <pre className="bg-black p-4 rounded overflow-auto max-h-[600px] font-mono">
                    <div key={idx} className={getLineStyle(fileDiff)}>
                    {fileDiff}
                  </div>
                  </pre> */}
                  <div className="overflow-auto max-h-[300px] font-mono">
                {fileDiff.split('\n').map((line, lineIdx) => {
                  const trimmed = line.trimStart();

                  let colorClass = "text-gray-300"; // default
                  if (trimmed.startsWith("+") && !trimmed.startsWith("+++")) colorClass = "text-green-400";
                  else if (trimmed.startsWith("-") && !trimmed.startsWith("---")) colorClass = "text-red-400";
                  else if (trimmed.startsWith("@@")) colorClass = "text-blue-400";
                  else if (["diff", "index", "---", "+++"].some(prefix => trimmed.startsWith(prefix))) colorClass = "text-yellow-300";

                  return (
                    <div key={lineIdx} className={colorClass}>
                      {line}
                    </div>
                  );
                })}
              </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default App;
