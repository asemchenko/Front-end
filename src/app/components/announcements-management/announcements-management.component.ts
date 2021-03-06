import {Component, Input, OnInit} from '@angular/core';
import {PublishAnnouncementService} from '../../service/publish-announcement.service';
import {Page} from '../../models/page';
import {Announcement} from '../../models/announcement';
import {AnnouncementService} from '../../service/announcement.service';
import {PageEvent} from '@angular/material';
import {ListItemInfo} from '../../models/presentation-models/list-item-info';
import {DatePipe} from '@angular/common';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-announcements-management',
  templateUrl: './announcements-management.component.html',
  styleUrls: ['./announcements-management.component.css'],
  providers: [DatePipe]
})
export class AnnouncementsManagementComponent implements OnInit {
  pageLoading: boolean;
  emptyPage: Page<ListItemInfo> = {currentPage: 0, pageSize: 5, countPages: 0, array: null};
  selectedPage: Page<ListItemInfo> = new Page<ListItemInfo>();

  constructor(private publishAnnouncementService: PublishAnnouncementService,
              public datePipe: DatePipe,
              private announcementService: AnnouncementService) {
  }

  ngOnInit() {
    this.resetPaginator();
    this.getAnnouncements();
  }


  getAnnouncements(): void {
    this.pageLoading = true;
    this.announcementService.getAnnouncements(this.selectedPage.currentPage, this.selectedPage.pageSize)
      .pipe(map(page => {
        return this.mapPage(page);
      }))
      .subscribe(selectedPage => {
        this.selectedPage = selectedPage;
        this.pageLoading = false;
      });
  }

  private mapPage(page: Page<Announcement>): Page<ListItemInfo> {
    return {
      currentPage: page.currentPage,
      countPages: page.countPages,
      pageSize: page.pageSize,
      array: page.array.map(announcement => {
        console.log(announcement.published);
        return {
          itemId: announcement.announcementId,
          title: announcement.title,
          subtitle: this.datePipe.transform(announcement.creationTime, 'd LLLL yyyy, h:mm'),
          photoPath: null,
          publish: announcement.published,
          contentElements: [
            {contentInfoId: 1, title: null, content: announcement.description},
          ],
          actionElements: [
            {
              buttonInfoId: 1, name: 'Publish', url: null, disabled: announcement.published,
              clickFunction: () => {
                const subscription = this.publishAnnouncementService.publishAnnouncement(announcement.announcementId)
                  .subscribe(() => subscription.unsubscribe());
              }
            },
            {
              buttonInfoId: 2, name: 'Unpublish', url: null, disabled: !announcement.published,
              clickFunction: () => {
                const subscription = this.publishAnnouncementService.unpublishedAnnouncement(announcement.announcementId)
                  .subscribe(() => subscription.unsubscribe());
              }
            }
          ],
          listItemCallback: null,
          additionalParams: null
        };
      })
    };
  }

  handlePage(event?: PageEvent) {
    this.selectedPage.currentPage = event.pageIndex;
    this.selectedPage.pageSize = event.pageSize;
    this.getAnnouncements();
  }

  private resetPaginator() {
    this.selectedPage = this.emptyPage;
  }
}
