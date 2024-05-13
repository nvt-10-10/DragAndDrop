$(function () {
    const categoryList = $(".category-list");
    const categoryItems = $(".category-item");

    // Khởi tạo hiệu ứng kéo thả
    categoryList
        .sortable({
            items: categoryItems,
            helper: "clone",
            start: function (event, ui) {
                $(ui.helper).addClass("dragging");
            },
            stop: function (event, ui) {
                updatePaths(ui.item);
                updateStt(ui.item.parent("ul.category-list"));
            },
            update: function (event, ui) {
                updatePaths(ui.item);
                updateStt(ui.item.parent("ul.category-list"));
            },
        })
        .disableSelection();

    let draggingItem = null;

    categoryItems.on("dragstart", function (e) {
        draggingItem = $(this);
        e.originalEvent.dataTransfer.effectAllowed = "move";
        e.originalEvent.dataTransfer.setData("text/plain", $(this).data("id"));
    });

    categoryItems.on("dragover", function (e) {
        e.preventDefault();
        if ($(this).is(".category-item") && !$(this).is(draggingItem)) {
            $(this).addClass("drag-over");
        }
    });

    categoryItems.on("drop", function (e) {
        e.preventDefault();
        if ($(this).is(".category-item") && !$(this).is(draggingItem)) {
            const targetId = parseInt($(this).data("id"));
            const draggingItemId = parseInt(draggingItem.data("id"));
            const targetParent = getParentWithId($(this), targetId);
            const draggingItemParent = getParentWithId(
                draggingItem,
                draggingItemId
            );

            const samePath =
                targetParent.data("path") === draggingItemParent.data("path");

            if (samePath) {
                const targetIndex = targetParent
                    .children(".category-item")
                    .index($(this));
                const draggingItemIndex = targetParent
                    .children(".category-item")
                    .index(draggingItem);
                draggingItem.insertBefore(
                    targetParent.children(".category-item").eq(targetIndex)
                );
            } else {
                draggingItemParent.find(".category-item").remove(draggingItem);
                draggingItem.insertBefore($(this));
                updatePaths(draggingItem);
            }

            categoryItems.removeClass("drag-over");
        }
    });

    function getParentWithId(element, id) {
        const parent = element.parent();
        if (parent.is(".category-list")) {
            return parent;
        }
        const parentId = parseInt(parent.data("id"));
        return parentId === id ? parent : getParentWithId(parent, id);
    }

    function updatePaths(element) {
        const parentList = element.parent("ul.category-list");
        const parentPath = parentList.data("path") || "";
        const newPath = parentPath
            ? `${parentPath}_${element.data("id")}`
            : element.data("id");

        element.data("path", newPath);
        element.attr("data-path", newPath);

        element.find(".category-item").each(function () {
            updatePaths($(this));
        });
    }

    function updateStt(parentList) {
        parentList.children(".category-item").each(function (index) {
            $(this).data("stt", index + 1);
            $(this).attr("data-stt", index + 1);
        });
    }
});
