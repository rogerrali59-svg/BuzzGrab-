
import '../../../export.dart';

class MultiSelectDropdown extends StatefulWidget {
  final String labelText;
  final List<String> items;
  final RxList<String> selectedItems;
  final String? Function(List<String>?)? validator;
  final TextEditingController textController;

  const MultiSelectDropdown({
    super.key,
    required this.labelText,
    required this.items,
    required this.selectedItems,
    this.validator,
    required this.textController,
  });

  @override
  _MultiSelectDropdownState createState() => _MultiSelectDropdownState();
}

class _MultiSelectDropdownState extends State<MultiSelectDropdown> {
  @override
  void initState() {
    super.initState();

    // Immediate update to text field with current selected items
    widget.textController.text = widget.selectedItems.join(', ');

    // Add listener ONCE
    ever(widget.selectedItems, (_) {
      widget.textController.text = widget.selectedItems.join(', ');
    });
    //    // Initialize text with selected service names joined by commas
    //     widget.textController.text = widget.selectedItems.map((e) => e.name.toString()).join(', ');
    //
    //     // Listen for changes in selectedItems and update textController accordingly
    //     ever(widget.selectedItems, (_) {
    //       widget.textController.text = widget.selectedItems.map((e) => e.name.toString()).join(', ');
    //     });
  }

  @override
  Widget build(BuildContext context) {
    return TextFieldWidget(
      readOnly: true,
      labelText: widget.labelText,
      suffixIcon: Icon(
        Icons.keyboard_arrow_down,
        color: Colors.grey,
        size: font_30,
      ),
      onTap: () {
        Get.dialog(
          AlertDialog(
            title: Text(widget.labelText),
            content: Obx(
                  () => SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: widget.items.map((service) {
                    final bool isSelected = widget.selectedItems.contains(service);
                    return CheckboxListTile(
                      activeColor: colorAppColor,
                      title: Text(service),
                      value: isSelected,
                      onChanged: (bool? newValue) {
                        if (newValue == true) {
                          widget.selectedItems.add(service);
                        } else {
                          widget.selectedItems.remove(service);
                        }
                      },
                    );
                  }).toList(),
                ),
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Get.back(),
                child: const Text('OK'),
              ),
            ],
          ),
        );
      },
      textController: widget.textController,
    );
  }
}
