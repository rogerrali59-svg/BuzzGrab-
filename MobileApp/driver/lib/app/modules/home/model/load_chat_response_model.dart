

class LoadChatResponseModel {
  String? chatId;
  List<LoadChatDataModel>? data;
  Meta? meta;
  Sender? otherUser;
  int? status;

  LoadChatResponseModel(
      {this.chatId, this.data, this.meta, this.otherUser, this.status});

  LoadChatResponseModel.fromJson(Map<String, dynamic> json) {
    chatId = json['chat_id'];
    if (json['data'] != null) {
      data = <LoadChatDataModel>[];
      json['data'].forEach((v) {
        data!.add(new LoadChatDataModel.fromJson(v));
      });
    }
    meta = json['meta'] != null ? new Meta.fromJson(json['meta']) : null;
    otherUser = json['other_user'] != null
        ? new Sender.fromJson(json['other_user'])
        : null;
    status = json['status'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['chat_id'] = this.chatId;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    if (this.meta != null) {
      data['meta'] = this.meta!.toJson();
    }
    if (this.otherUser != null) {
      data['other_user'] = this.otherUser!.toJson();
    }
    data['status'] = this.status;
    return data;
  }
}




class LoadChatDataModel {
  dynamic id;
  Sender? sender;
  dynamic receiver;
  dynamic message;
  dynamic messageFile;
  dynamic createdOn;
  dynamic seen;

  LoadChatDataModel(
      {this.id,
        this.sender,
        this.receiver,
        this.message,
        this.messageFile,
        this.seen,
        this.createdOn});

  LoadChatDataModel.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    sender =
    json['sender'] != null ? new Sender.fromJson(json['sender']) : null;
    receiver = json['receiver'];
    message = json['message'];
    messageFile = json['message_file'];
    createdOn = json['created_on'];
    seen = json['seen'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    if (this.sender != null) {
      data['sender'] = this.sender!.toJson();
    }
    data['receiver'] = this.receiver;
    data['message'] = this.message;
    data['message_file'] = this.messageFile;
    data['created_on'] = this.createdOn;
    data['seen'] = this.seen;
    return data;
  }
}

class Sender {
  dynamic id;
  dynamic fullName;
  dynamic profilePic;

  Sender({this.id, this.fullName, this.profilePic});

  Sender.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    fullName = json['full_name'];
    profilePic = json['profile_pic'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['full_name'] = this.fullName;
    data['profile_pic'] = this.profilePic;
    return data;
  }
}


class Links {
  Self? self;
  Self? first;
  Self? last;

  Links({this.self, this.first, this.last});

  Links.fromJson(Map<String, dynamic> json) {
    self = json['self'] != null ? new Self.fromJson(json['self']) : null;
    first = json['first'] != null ? new Self.fromJson(json['first']) : null;
    last = json['last'] != null ? new Self.fromJson(json['last']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.self != null) {
      data['self'] = this.self!.toJson();
    }
    if (this.first != null) {
      data['first'] = this.first!.toJson();
    }
    if (this.last != null) {
      data['last'] = this.last!.toJson();
    }
    return data;
  }
}

class Self {
  dynamic href;

  Self({this.href});

  Self.fromJson(Map<String, dynamic> json) {
    href = json['href'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['href'] = this.href;
    return data;
  }
}

class Meta {
  int? totalCount;
  int? pageCount;
  int? currentPage;
  int? perPage;

  Meta({this.totalCount, this.pageCount, this.currentPage, this.perPage});

  Meta.fromJson(Map<String, dynamic> json) {
    totalCount = json['total_results'];
    pageCount = json['page_count'];
    currentPage = json['current_page_no'];
    perPage = json['limit'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['total_results'] = this.totalCount;
    data['page_count'] = this.pageCount;
    data['current_page_no'] = this.currentPage;
    data['limit'] = this.perPage;
    return data;
  }
}
