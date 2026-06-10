export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    // إضافة مقال جديد عبر طلب POST
    if (pathname === "/add" && request.method === "POST") {
      const { title, content } = await request.json();
      await env.DB.prepare("INSERT INTO articles (title, content) VALUES (?, ?)")
        .bind(title, content)
        .run();
      return new Response("تمت إضافة المقال بنجاح! ✅");
    }

    // عرض جميع المقالات
    if (pathname === "/list") {
      const { results } = await env.DB.prepare("SELECT * FROM articles").all();
      return Response.json(results);
    }

    return new Response("أهلاً بك! استخدم /list لعرض المقالات.");
  },

};
