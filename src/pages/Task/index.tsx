import React, { useEffect, useState } from "react";

const DEMO_DATA = [
  {
    id: "001",
    name: "Default Task",
    desc: "Default Description",
    deadline: "Default Date",
  },
];

const TASK_ITEMS = "taskItems";

type TaskTypes = {
  id: string;
  name: string;
  desc: string;
  deadline: string;
};

/**
 * Desc: Task component
 * @returns {JSX.Element}
 */
const Task = (): JSX.Element => {
  const [showForm, setShowForm] = useState(false);
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState<any>(null);
  const [showList, setShowList] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputDeadline, setInputDeadline] = useState("");
  const [items, setItems] = useState<TaskTypes[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(TASK_ITEMS);
    if (data !== null) {
      setItems(JSON.parse(data));
    } else {
      // to show sample data
      setItems(DEMO_DATA);
    }
  }, []);

  // HANDLING INPUT FIELDS
  const handleInput = (e: any) => {
    setInputTitle(e.target.value);
  };
  const handleInputDesc = (e: any) => {
    setInputDesc(e.target.value);
  };
  const handleInputDeadline = (e: any) => {
    setInputDeadline(e.target.value);
  };

  /**
   * desc: Method to reset fields
   */
  const resetFields = () => {
    setInputTitle("");
    setInputDesc("");
    setInputDeadline("");
  };

  /**
   * desc: Method to update task
   */
  const updateTask = () => {
    const updatedData = items.map((elem) => {
      if (elem.id === isEditItem) {
        return {
          ...elem,
          name: inputTitle,
          desc: inputDesc,
          deadline: inputDeadline,
        };
      }
      return elem;
    });
    localStorage.setItem(TASK_ITEMS, JSON.stringify(updatedData));
    setItems(updatedData);
    resetFields();
    setShowForm(false);
  };

  /**
   * desc: Method to create new task
   */
  const createTask = () => {
    const allInputTitle = {
      id: new Date().getTime().toString(),
      name: inputTitle,
      desc: inputDesc,
      deadline: inputDeadline,
    };
    setItems([allInputTitle, ...items]);
    localStorage.setItem(TASK_ITEMS, JSON.stringify([allInputTitle, ...items]));
    resetFields();
    setShowForm(false);
  };

  /**
   * desc: Method to handle submit action
   * @param event
   */
  const handleSubmit = (e: any) => {
    setShowList(true);
    e.preventDefault();
    if (!inputTitle) {
      alert("Title is required");
      setShowList(false);
    } else if (inputTitle && !toggleSubmit) {
      updateTask();
    } else {
      createTask();
    }
  };

  /**
   * desc: Method to handle delete task
   * @param id
   */
  const handleDelete = (id: string) => {
    const updatedItems = items.filter((elem) => {
      return id !== elem.id;
    });

    setTimeout(() => {
      setItems(updatedItems);
      setDeleteMessage(false);
    }, 1000);
    setDeleteMessage(true);
  };

  /**
   * desc: Method to handle edit task
   * @param id task id
   */
  const handleEdit = (id: string) => {
    setShowList(false);
    setShowForm(true);

    setToggleSubmit(false);
    let newEditItem = items.find((elem) => {
      return elem.id === id;
    });

    setInputTitle(newEditItem?.name || "");
    setInputDesc(newEditItem?.desc || "");
    setInputDeadline(newEditItem?.deadline || "");
    setIsEditItem(id);
  };

  /**
   * desc: Method to handle add task
   */
  const handleAdd = () => {
    setShowList(false);
    setToggleSubmit(true);
    resetFields();
    setShowForm(true);
  };

  /**
   * desc: Method to handle close form
   */
  const handleCloseForm = () => {
    setShowForm(false);
    setShowList(true);
  };

  /**
   * desc: Method to render task list
   * @returns {JSX.Element[]} array of JSX element
   */
  const renderItemList = (): JSX.Element[] => {
    return items.map((elem, index) => {
      return (
        <div
          className="row border rounded shadow p-3 mb-3 bg-white rounded  p-2"
          key={elem.id}
        >
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div>
              <h4>
                {elem.name} {elem.deadline !== "" && `| ${elem.deadline}`}
              </h4>
              <p>{elem.desc}</p>
            </div>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-primary mx-2"
                onClick={() => handleEdit(elem.id)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger mx-2"
                onClick={() => handleDelete(elem.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  /**
   * desc: Method to render task add/update form
   * @returns {JSX.Element}
   */
  const renderForm = (): JSX.Element => {
    return (
      <div className="container border rounded d-flex justify-content-center shadow p-3 mb-5 bg-white rounded">
        <div className="row">
          <a
            className="text-right text-decoration-none cross-icon"
            onClick={handleCloseForm}
          >
            X
          </a>
          <div className="text-center">
            <h2>{toggleSubmit ? "Add Task" : " Edit Task"}</h2>
          </div>
          <form
            className="col-12 p-2"
            onSubmit={handleSubmit}
            data-testid="taskForm"
          >
            <label htmlFor="title">Enter Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="title"
              className="w-100 my-1 p-2"
              onChange={handleInput}
              value={inputTitle}
            />
            <label htmlFor="description">Enter Description</label>
            <textarea
              rows={4}
              name="description"
              id="description"
              placeholder="Description"
              className="w-100 my-1 p-2"
              onChange={handleInputDesc}
              value={inputDesc}
            />
            <label htmlFor="deadline">Enter Deadline</label>
            <input
              type={"date"}
              name="deadline"
              id="deadline"
              className="w-100 my-1 p-2"
              onChange={handleInputDeadline}
              value={inputDeadline}
            />

            <button className="btn btn-primary">
              {toggleSubmit ? "Save" : "Update"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="container mt-3 mb-3">
        <div className="col-12 text-end">
          <button className="btn btn-primary" onClick={handleAdd}>
            Create New Task
          </button>
        </div>
      </div>

      {showForm && renderForm()}

      {showList && (
        <div className="container py-2 ">
          {deleteMessage && (
            <p className="text-center text-danger">Item Deleted Successfully</p>
          )}
          {renderItemList()}
        </div>
      )}
    </>
  );
};

export default Task;
