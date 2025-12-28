interface ChapterCategory {
    _id: string,
    name: string,
    slug: string,
}

interface ChapterCourse {
    name: string,
    slug: string,
    _id: string,
}

interface ChapterVideos {
    videoLength: string,
    name: string,
    slug: string,
    _id: string,
}

export interface ChapterList {
    about: string,
    category: string,
    chapterCategory: ChapterCategory,
    chapterCourse: ChapterCourse,
    chapterVideos: Array<ChapterVideos>,
    course: string,
    deleted: boolean
    name: string,
    order: number,
    slug: string,
    status: boolean,
    totalTime: string,
    _id: string,
}
