<ul class="grid">
    <% for (var i=0; i<models.length; i++){ %>
    <li class="grid-item">
        <div class="modelcard" data-uid="<%= models[i].uid %>">
            <a href="<%= models[i].viewerUrl %>" target="_blank">
                <% if (models[i] && models[i].thumbnails && models[i].thumbnails.images &&  models[i].thumbnails.images[3] ) {  %>
                <div class="modelcard-preview" style="background-image: url(<%= models[i].thumbnails.images[3].url %>)">
                <% } else {  %>
                <div class="modelcard-preview">
                <% } %>
                    <div class="fallback-container">
                    </div>
                    <div class="fallback-loader"></div>
                    <div class="meta">
                        <% if (models[i].likeCount) { %>
                        <span class="count" title="Likes">
                            <i class="icon ion-ios7-star"></i> <%= models[i].likeCount %>
                        </span>
                        <% } %>
                        <% if (models[i].commentCount) { %>
                        <span class="count" title="Comments">
                            <i class="icon ion-ios7-chatbubble"></i> <%= models[i].commentCount %>
                        </span>
                        <% } %>
                    </div>
                    <span class="model-author">
                            <% if (models[i].user.avatars && models[i].user.avatars.images && models[i].user.avatars.images[2]) { %>
                            <img src="<%= models[i].user.avatars.images[2].url %>" width="20" height="20" class="avatar">
                            <% } %>
                            <%= models[i].user.displayName %>
                        </span>
                </div>
                <div class="modelcard-info">
                    <span class="model-title" title="<%= models[i].name %>"><%= models[i].name %></span>
                </div>
            </a>
        </div>
    </li>
    <% } %>
</ul>
<div class="more">
    Loading...
</div>
