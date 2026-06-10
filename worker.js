export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    // هذا هو كود الـ HTML الذي سألت عنه، مدمج داخل كود الـ Worker
    if (pathname === "/") {
      return new Response(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head><meta charset="UTF-8"></head>
        <body>
          <h2>إضافة مقال جديد</h2>
          <input id="title" placeholder="عنوان المقال"><br><br>
          <textarea id="content" placeholder="محتوى المقال"></textarea><br><br>
          <button onclick="addArticle()">إضافة المقال</button>
          <script>
            async function addArticle() {
              const title = document.getElementById('title').value;
              const content = document.getElementById('content').value;
              const response = await fetch('/add', {
                method: 'POST',
                body: JSON.stringify({ title, content })
              });
              alert(await response.text());
            }
          </script>
        </body>
        </html>
      `, { headers: { "Content-Type": "text/html" } });
    }

    if (pathname === "/add" && request.method === "POST") {
      const { title, content } = await request.json();
      await env.DB.prepare("INSERT INTO articles (title, content) VALUES (?, ?)")
        .bind(title, content)
        .run();
      return new Response("تمت إضافة المقال بنجاح! ✅");
    }

    if (pathname === "/list") {
      const { results } = await env.DB.prepare("SELECT * FROM articles").all();
      return Response.json(results);
    }

    return new Response("الصفحة غير موجودة", { status: 404 });
  },
  
};
