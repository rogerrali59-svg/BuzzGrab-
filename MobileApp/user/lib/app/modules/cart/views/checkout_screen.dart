
import '../../../../export.dart';
import '../controller/check_out_controller.dart';



class CheckoutScreen extends StatelessWidget {
  // Use Get.put to initialize the controller and make it available
  final  controller = Get.put(CheckOutController());

  // Custom Colors
  static const Color primaryGreen = Color(0xFF4CAF50);
  static const Color primaryText = Colors.black;
  static const Color secondaryText = Colors.grey;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
          return <Widget>[
            // 1. Fixed SliverAppBar for Back Button and Title
            SliverAppBar(
              floating: false,
              pinned: true,
              snap: false,
              backgroundColor: Colors.white,
              elevation: 0,
              leading: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.black),
                onPressed: () => Get.back(),
              ),
              centerTitle: true,
              title: Obx(() => Text(
                controller.groupName,
                style:  TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: font_18),
              )),
            ),

            // 2. SliverToBoxAdapter for the large image banner (scrolls)
            SliverToBoxAdapter(
              child: Container(
                color: Colors.white, // Ensures background is white
                child: Stack(
                  children: [
                    NetworkImageWidget(
                      imageurl: controller.bannerUrl,
                      imageFitType: BoxFit.fill,
                      imageHeight: 200,
                      imageWidth: Get.width,
                    ).marginSymmetric(horizontal: margin_20, vertical: margin_10),
                  ],
                ).marginOnly(bottom: margin_12),
              ),
            ),

            // 3. Header containing Group Details and Action Buttons
            SliverToBoxAdapter(
              child: _buildGroupHeader(context),
            ),

            // 4. Pinned Tab Bar (Posts/Members)
            SliverPersistentHeader(
              delegate: _GroupTabBarDelegate(
                // Uses Obx to react to changes in selectType from controller
                child: Obx(() => _buildTabBar()),
              ),
              pinned: true,
            ),
          ];
        },
        // Body (Conditional View based on selectType)
        body: Obx(() {
          if (controller.selectType.value == 1) {
            return _buildPostFeed();
          } else {
            return const Center(
                child: Text('Members List Coming Soon', style: TextStyle(color: secondaryText)));
          }
        }),
      ),
      bottomNavigationBar: _buildLeaveGroupButton(),
    );
  }

  // --- Helper Widgets ---

  Widget _buildGroupHeader(BuildContext context) {
    return Obx(() => Padding(
      padding:  EdgeInsets.symmetric(horizontal: margin_20, vertical: margin_10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Group Name (optional, since it's in the AppBar now, but keeping stats)
          Row(
            children: [
               Icon(Icons.people, size: font_16, color: primaryText),
               SizedBox(width: 5),
              Text(
                '${controller.membersCount} members',
                style: textStyleBodyMedium().copyWith(fontSize: font_14),
              ),
              const SizedBox(width: 10),
              const Icon(Icons.circle, size: 6, color: secondaryText),
              const SizedBox(width: 10),
              Text(
                controller.visibility,
                style: textStyleBodyMedium().copyWith(fontSize: font_14),
              ),
            ],
          ),
           SizedBox(height: margin_20),
          // Action Buttons: Joined / Group Chat
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 0),
            child: Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    title: "Joined",
                    isSelected: controller.isJoinedTab.value,
                    onTap: () => controller.isJoinedTab.value = true,
                  ),
                ),
                 SizedBox(width: margin_10),
                Expanded(
                  child: _buildActionButton(
                    title: "Group Chat",
                    isSelected: !controller.isJoinedTab.value,
                    onTap: () => controller.isJoinedTab.value = false,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ));
  }

  Widget _buildActionButton({required String title, required bool isSelected, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? primaryGreen : Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: isSelected ? primaryGreen : primaryGreen),
        ),
        alignment: Alignment.center,
        child: Text(
          title,
          style: TextStyle(
            color: isSelected ? Colors.white : primaryGreen,
            fontWeight: FontWeight.w600,
            fontSize: font_16,
          ),
        ),
      ),
    );
  }

  Widget _buildTabBar() {
    return Container(
      color: Colors.white,
      child: Row(
        children: [
          Expanded(
              child: _tabBarItem(
                  title: 'Posts',
                  isActive: controller.selectType.value == 1,
                  onTap: () {
                    controller.selectType.value = 1;
                  })),
          Expanded(
              child: _tabBarItem(
                  title: 'Members',
                  isActive: controller.selectType.value == 2,
                  onTap: () {
                    controller.selectType.value = 2;
                  })),
        ],
      ),
    );
  }

  Widget _tabBarItem({required String title, required bool isActive, required VoidCallback onTap}) {
    return InkWell(
      splashColor: Colors.transparent,
      onTap: onTap,
      child: Column(
        children: [
          Text(title, style: textStyleBodyMedium().copyWith(fontSize: font_16))
              .marginSymmetric(vertical: margin_10),
          Container(
            height: 2,
            width: double.infinity,
            color: isActive ? primaryGreen : Colors.transparent,
          )
        ],
      ),
    );
  }

  // --- Posts Feed ---

  Widget _buildPostFeed() {
    // The Obx builder ensures the ListView rebuilds when the posts list changes.
    return Obx(() => ListView.builder(
      padding: EdgeInsets.zero,
      itemCount: controller.posts.length,
      itemBuilder: (context, index) {
        final post = controller.posts[index];
        return _buildPostCard(post);
      },
    ));
  }

  Widget _buildPostCard(GroupPost post) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 15.0),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Color(0xFFF0F0F0), width: 1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // User Info and Follow Button (Uses Obx to react to isFollowing state)
          Padding(
            padding:  EdgeInsets.symmetric(horizontal: margin_20),
            child: Row(
              children: [
                // Avatar Placeholder
                 NetworkImageWidget(imageurl: '', imageWidth: 30, imageHeight: height_30, imageFitType: BoxFit.fill),
                 SizedBox(width: margin_10),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(post.userName, style:  TextStyle(fontWeight: FontWeight.bold, color: primaryText, fontSize: font_16)),
                    Text(post.date, style:  TextStyle(color: secondaryText, fontSize: font_12)),
                  ],
                ),
                const Spacer(),
                Obx(() => GestureDetector(
                  onTap: () => controller.toggleFollow(post),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 8),
                    decoration: BoxDecoration(
                      color: post.isFollowing.value ? primaryGreen.withOpacity(0.1) : primaryGreen,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: post.isFollowing.value ? primaryGreen : Colors.transparent),
                    ),
                    child: Text(
                      post.isFollowing.value ? 'Following' : 'Follow',
                      style: TextStyle(
                        color: post.isFollowing.value ? primaryGreen : Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: font_14,
                      ),
                    ),
                  ),
                )),
                const SizedBox(width: 5),
                 Icon(Icons.more_vert, color: secondaryText, size: font_24),
              ],
            ),
          ),
          const SizedBox(height: 15),

          // Post Image
          NetworkImageWidget(imageurl:
          post.imageUrl,
            imageFitType: BoxFit.cover,
            imageWidth: double.infinity,
            imageHeight: 350,
          ),
          const SizedBox(height: 10),

          // Action Bar (Likes, Comments, Share) (Uses Obx for live counts)
          Padding(
            padding:  EdgeInsets.symmetric(horizontal: margin_20),
            child: Obx(() => Row(
              children: [
                _buildActionIcon(Icons.favorite_border, post.likes.value),
                const SizedBox(width: 20),
                _buildActionIcon(Icons.comment_outlined, post.comments.value),
                const SizedBox(width: 20),
                _buildActionIcon(Icons.share_outlined, ''),
              ],
            )),
          ),
          const SizedBox(height: 10),

          // Caption
          Padding(
            padding:  EdgeInsets.symmetric(horizontal: margin_20),
            child: Text(
              post.caption,
              style:  TextStyle(color: primaryText, fontSize: font_14),
            ),
          ),
          const SizedBox(height: 5),
          Padding(
            padding:  EdgeInsets.symmetric(horizontal: margin_20),
            child: Text(
              'Comments ${post.comments.value}',
              style: TextStyle(color: secondaryText, fontWeight: FontWeight.bold, fontSize: font_14),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionIcon(IconData icon, String count) {
    return Row(
      children: [
        Icon(icon, color: primaryText, size: font_24),
        if (count.isNotEmpty) const SizedBox(width: 5),
        if (count.isNotEmpty)
          Text(
            count,
            style:  TextStyle(color: primaryText, fontWeight: FontWeight.bold, fontSize: font_14),
          ),
      ],
    );
  }

  Widget _buildLeaveGroupButton() {
    return SafeArea(
      child: Padding(
        padding:  EdgeInsets.all(margin_20),
        child: GestureDetector(
          onTap: controller.leaveGroup,
          child:  Text(
            'Leave this group',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.red,
              fontWeight: FontWeight.bold,
              fontSize: font_16,
            ),
          ),
        ),
      ),
    );
  }
}


// Custom Delegate to make the tab bar sticky
class _GroupTabBarDelegate extends SliverPersistentHeaderDelegate {
  _GroupTabBarDelegate({required this.child});

  final Widget child;
  final double _height = 52.0;

  @override
  double get minExtent => _height;
  @override
  double get maxExtent => _height;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(color: Colors.white, child: child);
  }

  @override
  bool shouldRebuild(_GroupTabBarDelegate oldDelegate) {
    return true;
  }
}