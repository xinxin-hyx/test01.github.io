let currentModalData = {
    imageSrc: '',
    title: '',
    category: '',
    species: []
};

let currentZoom = 1;
let sortDirection = 1;
let currentSortColumn = -1;

function openModal(imageSrc, title, category, species) {
    currentModalData = {
        imageSrc,
        title,
        category,
        species
    };
    
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalCategory').textContent = `分类: ${category}`;
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modalImage').style.transform = 'scale(1)';
    currentZoom = 1;
    
    populateTable(species);
    document.getElementById('speciesModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('speciesModal').style.display = 'none';
}

function populateTable(species) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    species.forEach(specie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${specie.name}</td>
            <td>${specie.category}</td>
            <td>${specie.habitat}</td>
            <td>${specie.status}</td>
        `;
        tableBody.appendChild(row);
    });
}

function sortTable(columnIndex) {
    const table = document.getElementById('speciesTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // 重置所有表头的排序状态
    document.querySelectorAll('th').forEach(th => {
        th.classList.remove('asc', 'desc');
    });
    
    // 确定排序方向
    if (currentSortColumn === columnIndex) {
        sortDirection *= -1;
    } else {
        sortDirection = 1;
        currentSortColumn = columnIndex;
    }
    
    // 排序行
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent;
        const bValue = b.cells[columnIndex].textContent;
        return aValue.localeCompare(bValue) * sortDirection;
    });
    
    // 更新表头排序状态
    const th = table.querySelectorAll('th')[columnIndex];
    th.classList.add(sortDirection === 1 ? 'asc' : 'desc');
    
    // 重新添加行
    rows.forEach(row => tbody.appendChild(row));
}

function zoomImage(amount) {
    currentZoom += amount;
    currentZoom = Math.max(0.5, Math.min(3, currentZoom)); // 限制缩放范围
    document.getElementById('modalImage').style.transform = `scale(${currentZoom})`;
}

function resetImage() {
    currentZoom = 1;
    document.getElementById('modalImage').style.transform = 'scale(1)';
}

// 筛选功能
document.getElementById('filterInput').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let match = false;
        
        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(filter)) {
                match = true;
            }
        });
        
        row.style.display = match ? '' : 'none';
    });
});

// 点击弹窗外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('speciesModal');
    if (event.target == modal) {
        closeModal();
    }
}

// 图片加载错误处理
document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
        this.src = 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%23f0f0f0"/><text x="200" y="125" font-size="16" text-anchor="middle" fill="%23666">图片加载失败</text></svg>';
    };
});