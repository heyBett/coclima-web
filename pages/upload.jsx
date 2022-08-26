export default function Upload() {
  return (
    <div>
      <form
        action="http://localhost:80/api/fileUpload/upload"
        method="post"
        encType="multipart/form-data"
      >
        <input type="file" name="fileupload"></input>

        <input type="submit"></input>
      </form>
    </div>
  );
}
