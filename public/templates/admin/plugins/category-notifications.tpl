<h1>Category Notifications</h1>


<form class="form category-join-group-settings">
	<div class="row">
		<div class="col-sm-6 col-xs-12">
			<div class="form-group">
				<label>Category Groups Setting</label>
			</div>
		</div>
	</div>
</form>

<button class="btn btn-primary" id="save">Save</button>

<script type="text/javascript">
	'use strict';
	/* globals app */
	require(['settings'], function(Settings) {
		Settings.load('category-join-group', $('.category-join-group-settings'), function(err, settings) {
			if (err) {
				return app.alertError(err.message);
			}
		});

		$('#save').on('click', function() {
			Settings.save('category-join-group', $('.category-join-group-settings'), function(err) {
				if (err) {
					return app.alertError(err.message);
				}
				app.alertSuccess('Saved');
			});
			return false;
		});
	});

</script>