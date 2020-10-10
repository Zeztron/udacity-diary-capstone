import { History } from 'history'
import * as React from 'react'
import update from 'immutability-helper'

import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Modal,
  Form
} from 'semantic-ui-react'

import { createDiaryPost, patchDiaryPost, deleteDiaryPost, getDiaryPosts } from '../api/diary-api'
import Auth from '../auth/Auth'
import { DiaryPost } from '../types/DiaryPost'

interface DiaryProps {
  auth: Auth
  history: History
}

interface DiaryState {
  diaryPosts: DiaryPost[]
  newDiaryTitle: string,
  newDiaryBody: string,
  loadingDiaries: boolean,
  open: boolean,
  diaryPostToEdit: any
}

export class Diary extends React.PureComponent<DiaryProps, DiaryState> {
  state: DiaryState = {
    diaryPosts: [],
    newDiaryTitle: '',
    newDiaryBody: '',
    loadingDiaries: true,
    open: false,
    diaryPostToEdit: {}
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDiaryTitle: event.target.value })
  }

  handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDiaryBody: event.target.value })
  }

  handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ diaryPostToEdit: { ...this.state.diaryPostToEdit, title: event.target.value }})
  }

  handleBodyUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ diaryPostToEdit: { ...this.state.diaryPostToEdit, body: event.target.value }})
  }

  onEditButtonClick = (diaryPost: DiaryPost) => {
    this.props.history.push(`/diary/${diaryPost.diaryPostId}/edit`)
  }

  onDiaryPostCreate = async (event: any) => {

    if (!this.state.newDiaryTitle.length || !this.state.newDiaryBody.length) {
      alert("Missing body ot title")
      return
    }

    try {
      const newDiaryPost = await createDiaryPost(this.props.auth.getIdToken(), {
        title: this.state.newDiaryTitle,
        body: this.state.newDiaryBody
      })
      this.setState({
        diaryPosts: [...this.state.diaryPosts, newDiaryPost],
        newDiaryTitle: '',
        newDiaryBody: ''
      })
    } catch {
      alert('diary post creation failed')
    }
  }

  onDiaryPostUpdate = async (diaryPostToUpdate: DiaryPost) => {
    try {
      await patchDiaryPost(this.props.auth.getIdToken(), diaryPostToUpdate.diaryPostId, {
        title: diaryPostToUpdate.title,
        body: diaryPostToUpdate.body
      });

      const index = this.state.diaryPosts.findIndex(diaryPost => diaryPost.diaryPostId === diaryPostToUpdate.diaryPostId)
      this.setState({
        diaryPosts: update(this.state.diaryPosts, {
          [index]: { title: { $set: diaryPostToUpdate.title }, body: { $set: diaryPostToUpdate.body }}
        }),
        open: false
      })
    } catch {
      alert("update failed")
    }
  }

  onDiaryPostDelete = async (diaryPostId: string) => {
    try {
      await deleteDiaryPost(this.props.auth.getIdToken(), diaryPostId)
      this.setState({
        diaryPosts: this.state.diaryPosts.filter(diaryPost => diaryPost.diaryPostId != diaryPostId)
      })
    } catch {
      alert('diary deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const diaryPosts = await getDiaryPosts(this.props.auth.getIdToken())
      this.setState({
        diaryPosts,
        loadingDiaries: false
      })
    } catch (e) {
      alert(`Failed to fetch diary posts: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Diary Posts</Header>

        {this.renderCreateDiaryPosts()}

        {this.renderDiaryPosts()}

        {this.renderModal()}
      </div>
    )
  }

  renderCreateDiaryPosts() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            fluid
            actionPosition="left"
            placeholder="Dear Diary..."
            onChange={this.handleTitleChange}
          />
          <Input
            fluid
            actionPosition="left"
            placeholder="Today I..."
            onChange={this.handleBodyChange}
          />
          
        </Grid.Column>
        <Grid.Column width={10}>
          <Button onClick={this.onDiaryPostCreate}>Create Post</Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderDiaryPosts() {
    if (this.state.loadingDiaries) {
      return this.renderLoading()
    }

    return this.renderDiaryPostsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Diary Entries...
        </Loader>
      </Grid.Row>
    )
  }

  renderDiaryPostsList() {
    return (
      <Grid padded>
        {this.state.diaryPosts.map((diaryPost, pos) => {
          return (
            <Grid.Row key={diaryPost.diaryPostId}>
              
              <Grid.Column width={3} verticalAlign="middle">
                {diaryPost.title}
              </Grid.Column>
              <Grid.Column width={10} floated="right">
                {diaryPost.body}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.setState({ open: true, diaryPostToEdit: diaryPost })}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onDiaryPostDelete(diaryPost.diaryPostId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {diaryPost.attachmentUrl && (
                <Image src={diaryPost.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  renderModal() {
    return (
      <Modal
        onClose={() => this.setState({ open: false })}
        open={this.state.open}
      >
        <Modal.Header>Edit Diary Post</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form.Input
                defaultValue={this.state.diaryPostToEdit ? this.state.diaryPostToEdit.title :  ''}
                onChange={this.handleTitleUpdate}
              />
              <Form.Input
                defaultValue={this.state.diaryPostToEdit ? this.state.diaryPostToEdit.body : ''}
                onChange={this.handleBodyUpdate}
              />
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => this.setState({ open: false })}>
              Cancel
            </Button>
            <Button
              content="Submit"
              labelPosition='right'
              icon='checkmark'
              onClick={() => this.onDiaryPostUpdate(this.state.diaryPostToEdit)}
              positive
            />
          </Modal.Actions>
      </Modal>
    )
  }
}
