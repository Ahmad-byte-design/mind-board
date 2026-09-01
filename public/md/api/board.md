Action	Route	Notes
Load board	GET /api/v1/pages/{page}/board	returns all papers and strings at once — use this on page open
Create paper (new node)	POST /api/v1/pages/{page}/papers	body {content, x, y} → 201 with the new Paper (has id)
Edit paper text	PUT/PATCH /api/v1/papers/{paper}	body {content} (title/content)
Show one paper	GET /api/v1/papers/{paper}	"get show paper" ✓
Connect two papers	POST /api/v1/pages/{page}/strings	body {paper1_id, paper2_id} → 201 returns the string id directly — cleanest for onConnect, set the edge id from the response
Move papers (drag)	PATCH /api/v1/pages/{page}/board	{papers:[{id,x,y}]} — batched, only changed ones
Batch connect (autosave)	PATCH /api/v1/pages/{page}/board	can also send strings:[{paper1_id,paper2_id}] → returns created_strings ids
Delete string	DELETE /api/v1/strings/{	 