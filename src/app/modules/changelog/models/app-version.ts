export class AppVersion {
  id: string;
  major: number;
  minor: number;
  patch: number;
  date: number;
  versionCode: number;
  versionName: string;
  vName: string;
  details: VersionDetail;
  published: boolean;
}

export class VersionDetail {
  new: string[];
  fixed: string [];
  improved: string [];
}
