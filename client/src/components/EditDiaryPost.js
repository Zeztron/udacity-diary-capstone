import React, { PureComponent } from 'react';
import { Form, Button } from 'semantic-ui-react';
import Auth from '../auth/Auth';
import { getUploadUrl, uploadFile } from '../api/diary-api';

const auth = new Auth();


class EditDiaryPost extends PureComponent {

  state = {
    file: undefined,
  }

  handleFileChange = e => {
    const { files } = e.target;

    if (!files) return;

    this.setState({ file: files[0] });
  }

  handleSubmit = async e => {
    e.preventDefault();

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      const uploadUrl = await getUploadUrl(auth.getIdToken(), this.props.match.params.diaryPostId);

      await uploadFile(uploadUrl, this.state.file);
      alert('File was uploaded!');
      
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    }
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        <Button

          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}

export default EditDiaryPost;