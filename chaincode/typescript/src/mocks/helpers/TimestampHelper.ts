import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

export class TimestampHelper {
  public now(): Timestamp {
    const now = new Timestamp();
    now.fromDate(new Date());
    return now;
  }
}
