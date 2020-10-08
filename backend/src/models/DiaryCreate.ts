export interface DiaryCreate {
  userId: string
  diaryPostId: string
  createdAt: string
  title: string
  body: string
  attachmentUrl?: string
}