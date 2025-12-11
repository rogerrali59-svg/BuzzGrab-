import '../../../../export.dart';

class CheckOutController extends GetxController {
  // --- Group Data (Mock) ---
  final Rx<GroupDetail> groupDetail = GroupDetail(
    id: 'g1',
    name: 'Golf Enthusiasts USA',
    bannerUrl: 'https://placehold.co/800x200/4CAF50/FFFFFF?text=Group+Banner',
    membersCount: 1234,
    visibility: 'Public',
  ).obs;

  // --- State Variables ---

  // 1. Tab Selection (Posts=1, Members=2)
  final selectType = 1.obs; // 1 for Posts (default), 2 for Members

  // 2. Action Button Selection (Joined/Group Chat)
  final isJoinedTab = true.obs;

  // 3. Mock Data for Posts
  final RxList<GroupPost> posts = <GroupPost>[
    GroupPost(
      id: 'p1',
      userId: 'u1',
      userName: 'Mark Taylor',
      userAvatarUrl: '', // Placeholder
      date: 'September 19',
      imageUrl: 'https://placehold.co/400x350/F5F5F5/4CAF50?text=Post+Image+1',
      caption: 'joshua_l Beautiful day at Augusta!',
      initialLikes: '10k',
      initialComments: '10k',
      initialIsFollowing: true,
    ),
    GroupPost(
      id: 'p2',
      userId: 'u2',
      userName: 'Sarah Jones',
      userAvatarUrl: '', // Placeholder
      date: 'September 18',
      imageUrl: 'https://placehold.co/400x350/F5F5F5/4CAF50?text=Post+Image+2',
      caption: 'Putting practice makes perfect.',
      initialLikes: '2.5k',
      initialComments: '500',
      initialIsFollowing: false,
    ),
  ].obs;

  // --- Computed/Derived Getters (for cleaner UI code) ---
  String get groupName => groupDetail.value.name;
  String get bannerUrl => groupDetail.value.bannerUrl;
  int get membersCount => groupDetail.value.membersCount;
  String get visibility => groupDetail.value.visibility;

  // --- Actions/Methods ---

  void changeTab(int type) {
    selectType.value = type;
  }

  void toggleFollow(GroupPost post) {
    post.toggleFollow();
    // Simulate updating backend
    Get.snackbar(
      post.isFollowing.value ? "Followed" : "Unfollowed",
      "You ${post.isFollowing.value ? 'are now following' : 'have unfollowed'} ${post.userName}.",
      snackPosition: SnackPosition.BOTTOM,
    );
  }

  void leaveGroup() {
    // In a real app: Call API to leave group
    Get.dialog(
      AlertDialog(
        title: const Text("Confirm Leave"),
        content: Text("Are you sure you want to leave ${groupName}?"),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () {
              // Simulate API call success
              Get.back(); // Close dialog
              Get.back(); // Navigate back to previous screen
              Get.snackbar("Success", "You have left $groupName.",
                  snackPosition: SnackPosition.BOTTOM);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text("Leave", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  // Example of reacting to button changes (not strictly needed for this UI but good practice)
  @override
  void onInit() {
    ever(isJoinedTab, (bool isJoined) {
      if (isJoined) {
        // Logic when Joined is selected
      } else {
        // Logic when Group Chat is selected
      }
    });
    super.onInit();
  }
}



/// Model

// --- Group Detail Model ---
class GroupDetail {
  final String id;
  final String name;
  final String bannerUrl;
  final int membersCount;
  final String visibility; // e.g., "Public", "Private"

  GroupDetail({
    required this.id,
    required this.name,
    required this.bannerUrl,
    required this.membersCount,
    required this.visibility,
  });
}

// --- Post Model ---
class GroupPost {
  final String id;
  final String userId;
  final String userName;
  final String userAvatarUrl;
  final String date;
  final String imageUrl;
  final String caption;
  // State for interaction, made Rx so we can observe changes
  final RxString likes;
  final RxString comments;
  final RxBool isFollowing; // State of the post author

  GroupPost({
    required this.id,
    required this.userId,
    required this.userName,
    required this.userAvatarUrl,
    required this.date,
    required this.imageUrl,
    required this.caption,
    String initialLikes = '0',
    String initialComments = '0',
    bool initialIsFollowing = false,
  }) : likes = initialLikes.obs,
        comments = initialComments.obs,
        isFollowing = initialIsFollowing.obs;

  // Method to toggle follow status
  void toggleFollow() {
    isFollowing.value = !isFollowing.value;
  }
}