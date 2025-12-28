interface VideoCategory {
    name: string,
    slug: string,
    _id: string,
}

interface VideoChapter {
    name: string,
    slug: string,
    _id: string,
}

interface VideoCourse {
    name: string,
    slug: string,
    _id: string,
}

interface VideoReview {

}

export interface VideoList {
    about: string,
    category: string,
    chapter: string,
    course: string,
    deleted: boolean,
    isPrime: boolean
    videoLength: string,
    name: string,
    order: number,
    slug: string,
    status: boolean
    video: string,
    videoCategory: VideoCategory,
    videoChapter: VideoChapter
    videoCourse: VideoCourse,
    videoReviews: [],
    _id: string,
}
