import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/",
  method: "GET",
  handler: httpAction(async () => {
    return Response.redirect("https://combative-bandicoot-693.convex.site/", 302);
  })
});

export default http;
