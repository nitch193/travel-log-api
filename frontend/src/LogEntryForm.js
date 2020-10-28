import React, { useState } from "react";
import "./form.css";
import { useForm } from "react-hook-form";
import { createLogEntry } from "./API";
const LogEntryForm = ({ location, onClose }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const onSubmit = async (data) => {
    try {
      setloading(true);
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      const created = await createLogEntry(data);
      console.log(created);
      onClose();
    } catch (error) {
      seterror(error.message);
      setloading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entryform">
      {error ? <h3 className="errormsg">{error}</h3> : null}
      <label htmlFor="apiKey">API-KEY</label>
      <input type="password" name="apiKey" required ref={register} />
      <label htmlFor="title">Title</label>
      <input type="text" name="title" required ref={register} />
      <label htmlFor="comments">Comments</label>
      <textarea
        htmlFor="comments"
        name="comments"
        rows={3}
        ref={register}
      ></textarea>
      <label htmlFor="description">Description</label>
      <textarea
        htmlFor="description"
        name="description"
        rows={3}
        ref={register}
      ></textarea>
      <label htmlFor="image">Images</label>
      <input type="text" ref={register} name="image" />
      <label htmlFor="visitDate">VisitDate</label>
      <input type="date" name="visitDate" required ref={register} />
      <button disabled={loading}>
        {loading ? "Loading..." : "Create-Log"}
      </button>
    </form>
  );
};
export default LogEntryForm;
