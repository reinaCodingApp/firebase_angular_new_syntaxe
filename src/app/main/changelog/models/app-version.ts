export class AppVersion {
  major: number;
  minor: number;
  patch: number;
  date: number;
  versionCode: number;
  versionName: string;
  vName: string;
  details: VersionDetail;
}

export class VersionDetail {
  new: string[];
  fixed: string [];
  improved: string [];
}
