// Dữ liệu ví dụ
const data = [
    { id: 1, name: "Category 1", path: "1", stt: 1, parentId: 0 },
    { id: 2, name: "Category 1-1", path: "1_1", stt: 1, parentId: 1 },
    { id: 3, name: "Category 1-1-1", path: "1_1_1", stt: 1, parentId: 2 },
    { id: 4, name: "Category 1-1-2", path: "1_1_2", stt: 2, parentId: 2 },
    { id: 5, name: "Category 1-2", path: "1_2", stt: 2, parentId: 1 },
    { id: 6, name: "Category 1-2-1", path: "1_2_1", stt: 1, parentId: 5 },
    { id: 7, name: "Category 2", path: "2", stt: 2, parentId: 0 },
    { id: 8, name: "Category 2-1", path: "2_1", stt: 1, parentId: 7 },
    { id: 9, name: "Category 2-1-1", path: "2_1_1", stt: 1, parentId: 8 },
    { id: 10, name: "Category 2-1-2", path: "2_1_2", stt: 2, parentId: 8 },
];

// Hàm ánh xạ dữ liệu
function mapCategories(data) {
    const categoryMap = new Map();
    const hierarchicalData = [];

    // Tạo danh sách các danh mục gốc
    const rootCategories = data.filter((item) => item.parentId === 0);

    // Ánh xạ danh mục con vào danh mục cha
    data.forEach((item) => {
        const { id, name, path, stt } = item;
        const parentId = item.parentId;
        const children = categoryMap.has(id)
            ? categoryMap.get(id).children
            : [];
        categoryMap.set(id, { id, name, path, stt, parentId, children });

        if (parentId !== 0) {
            const parentCategory = categoryMap.get(parentId);
            parentCategory.children.push(categoryMap.get(id));
        } else {
            hierarchicalData.push(categoryMap.get(id));
        }
    });

    return hierarchicalData;
}

// Sử dụng hàm ánh xạ
const hierarchicalData = mapCategories(data);
console.log(JSON.stringify(hierarchicalData, null, 2));

export default hierarchicalData;
