## Think

### Why should a task have `assignee_id` as a foreign key instead of storing the assignee's name as text?

A user's name can be the same as another user's name, and it can also change. Therefore, we store the user's unique `id` as `assignee_id` to identify the assigned user correctly.

### What happens if the user changes their name?

Nothing happens to the task because changing the user's name does not change their unique `id`. The user can change their name, while the `assignee_id` remains the same.
