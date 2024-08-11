const postsList = document.getElementById('posts-list');
const postForm = document.getElementById('post-form');

// Función para obtener y mostrar las publicaciones
async function fetchPosts() {
	try {
		const response = await fetch('http://localhost:3004/posts');
		const posts = await response.json();

		// Limpiar la lista antes de actualizarla
		postsList.innerHTML = '';

		// Añadir cada post a la lista
		for (const post of posts) {
			const userResponse = await fetch(`http://localhost:3004/users/${post.userId}`);
			const user = await userResponse.json();

			const listItem = document.createElement('li');
			listItem.innerHTML = `
                <strong>ID: ${post.id}</strong><br>
                <strong>${post.title}</strong> by ${user.username}<br>
                ${post.body}<br>
                <button onclick="deletePost('${post.id}')">Delete</button>
            `;
			postsList.appendChild(listItem);
		}
	} catch (error) {
		console.error('Error fetching posts:', error);
	}
}

// Función para crear una nueva publicación
postForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const userId = document.getElementById('userId').value;
	const title = document.getElementById('title').value;
	const body = document.getElementById('body').value;

	try {
		const response = await fetch('http://localhost:3004/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userId, title, body }),
		});

		if (response.ok) {
			fetchPosts(); // Actualizar la lista después de crear el post
		}
	} catch (error) {
		console.error('Error creating post:', error);
	}
});

// Función para eliminar una publicación
async function deletePost(postId) {
	try {
		const response = await fetch(`http://localhost:3004/posts/${postId}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			fetchPosts(); // Actualizar la lista después de eliminar el post
		}
	} catch (error) {
		console.error('Error deleting post:', error);
	}
}

// Cargar las publicaciones al inicio
fetchPosts();
